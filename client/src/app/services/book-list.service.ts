import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Firestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import { AuthService } from '../app.auth.service';
import { switchMap, map } from 'rxjs/operators';

interface BookList {
  currentlyReading: any[];
  tbr: any[];
  read: any[];
}

@Injectable({
  providedIn: 'root',
})
export class BookListService {
  private lists: BookList = {
    currentlyReading: [],
    tbr: [],
    read: [],
  };

  private listsSubject = new BehaviorSubject<BookList>(this.lists);
  private userId: string | null = null;
  private pagesRead: number | undefined;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.userId = user?.uid || null;
      this.pagesRead = 0;
      if (this.userId) {
        this.loadUserLists();
      }
    });
  }

  // Hämta användarens listor från Firestore och uppdatera det lokala tillståndet
  private async loadUserLists() {
    if (!this.userId) return;

    const userDocRef = doc(this.firestore, 'users', this.userId);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      this.lists.currentlyReading = data?.['currentlyReading'] || [];
      this.lists.tbr = data?.['tbr'] || [];
      this.lists.read = data?.['read'] || [];
      this.listsSubject.next(this.lists);
    } else {
      console.log('Användardokument hittades inte.');
    }
  }

  async addToList(list: 'currentlyReading' | 'tbr' | 'read', book: any) {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte spara i Firestore.');
      return;
    }

    this.lists[list].push(book);
    this.listsSubject.next(this.lists);

    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userDocRef, {
        [list]: arrayUnion(book),
      });
    } catch (error) {
      console.error('Kunde inte uppdatera Firestore:', error);
    }
  }

  // async addToRead(book: any) {
  //   if (!this.userId) {
  //     console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
  //     return;
  //   }

  //   try {
  //     const userDocRef = doc(this.firestore, 'users', this.userId);

  //     await updateDoc(userDocRef, {
  //       read: arrayUnion(book),
  //       currentlyReading: arrayRemove(book),
  //     });

  //     this.lists.currentlyReading = this.lists.currentlyReading.filter(
  //       (b) => b.id !== book.id
  //     );
  //     this.lists.read.push(book);
  //     this.listsSubject.next(this.lists);
  //   } catch (error) {
  //     console.error('Kunde inte uppdatera Firestore:', error);
  //   }
  // }
  async addToRead(book: any) {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);

      const bookData = { id: book.id, pagesRead: book.pagesRead || 0 };

      await updateDoc(userDocRef, {
        read: arrayUnion(bookData),
        currentlyReading: arrayRemove({ id: book.id }), // Ta bort bara efter id
      });

      // Lokala listor uppdateras också
      this.lists.currentlyReading = this.lists.currentlyReading.filter(
        (b) => b.id !== book.id
      );
      this.lists.read.push(bookData);
      this.listsSubject.next(this.lists);
    } catch (error) {
      console.error('Kunde inte uppdatera Firestore:', error);
    }
  }

  // async removeFromCurrentlyReading(bookId: string) {
  //   if (!this.userId) {
  //     console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
  //     return;
  //   }

  //   try {
  //     const userDocRef = doc(this.firestore, 'users', this.userId);

  //     await updateDoc(userDocRef, {
  //       currentlyReading: arrayRemove({ id: bookId }),
  //     });

  //     this.lists.currentlyReading = this.lists.currentlyReading.filter(
  //       (b) => b.id !== bookId
  //     );
  //     this.listsSubject.next(this.lists);
  //   } catch (error) {
  //     console.error('Kunde inte uppdatera Firestore:', error);
  //   }
  // }
  async removeFromCurrentlyReading(book: { id: string; pagesRead: number }) {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);

      await updateDoc(userDocRef, {
        currentlyReading: arrayRemove(book), // Skicka in hela objektet direkt
      });

      this.lists.currentlyReading = this.lists.currentlyReading.filter(
        (b) => b.id !== book.id
      );
      this.listsSubject.next(this.lists);
    } catch (error) {
      console.error('Kunde inte uppdatera Firestore:', error);
    }
  }

  getLists(): Observable<BookList> {
    return this.listsSubject.asObservable();
  }

  // Hämtar aktuell lista från Firestore direkt som Observable
  getCurrentlyReading(): Observable<any[]> {
    return this.getListObservable('currentlyReading');
  }
  get listsValue(): BookList {
    return this.listsSubject.getValue();
  }

  getTbr(): Observable<any[]> {
    return this.getListObservable('tbr');
  }

  getRead(): Observable<any[]> {
    return this.getListObservable('read');
  }

  private getListObservable(listName: keyof BookList): Observable<any[]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        const userDocRef = doc(this.firestore, 'users', user.uid);
        return docData(userDocRef).pipe(
          map((data: any) => data?.[listName] || [])
        );
      })
    );
  }

  // async updatePagesRead(book: any, pagesRead: number) {
  //   if (!this.userId) {
  //     console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
  //     return;
  //   }

  //   try {
  //     const userDocRef = doc(this.firestore, 'users', this.userId);

  //     this.lists.currentlyReading = this.lists.currentlyReading.map((b) =>
  //       b.id === book.id ? { ...b, pagesRead: pagesRead } : b
  //     );
  //     console.log(this.lists.currentlyReading, 'hejdå');

  //     // Uppdatera Firestore
  //     await updateDoc(userDocRef, {
  //       currentlyReading: this.lists.currentlyReading,
  //     });
  //     this.pagesRead = pagesRead;
  //     this.listsSubject.next(this.lists);
  //   } catch (error) {
  //     console.error('Kunde inte uppdatera Firestore:', error);
  //   }
  // }
  async updatePagesRead(book: any, pagesRead: number) {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);

      // Uppdatera lokalt
      this.lists.currentlyReading = this.lists.currentlyReading.map((b) =>
        b.id === book.id ? { ...b, pagesRead } : b
      );

      // Uppdatera i Firestore
      await updateDoc(userDocRef, {
        currentlyReading: this.lists.currentlyReading,
      });

      this.listsSubject.next(this.lists);
    } catch (error) {
      console.error('Kunde inte uppdatera Firestore:', error);
    }
  }

  // calculateProgress(book: any): number {
  //   console.log(book, 'hej');

  //   if (!book.volumeInfo.pageCount || book.volumeInfo.pageCount === 0) return 0;
  //   const progress = (this.pagesRead ?? 0 / book.volumeInfo.pageCount) * 100;
  //   return Math.min(Math.max(progress, 0), 100);
  // }
  calculateProgress(book: any): number {
    if (!book.volumeInfo.pageCount || book.volumeInfo.pageCount === 0) return 0;
    const progress = ((book.pagesRead ?? 0) / book.volumeInfo.pageCount) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  async removeBookFromCurrentlyReading(bookId: string) {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);

      await updateDoc(userDocRef, {
        currentlyReading: arrayRemove({ id: bookId }),
      });

      this.lists.currentlyReading = this.lists.currentlyReading.filter(
        (b) => b.id !== bookId
      );
      this.listsSubject.next(this.lists);
    } catch (error) {
      console.error('Kunde inte uppdatera Firestore:', error);
    }
  }
}
