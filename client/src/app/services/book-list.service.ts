import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
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

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.userId = user?.uid || null;
      if (this.userId) {
        this.loadUserLists();
      }
    });
  }

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
    }
  }

  addToList(list: keyof BookList, book: any): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte spara i Firestore.');
      return of(undefined);
    }

    this.lists[list].push(book);
    this.listsSubject.next(this.lists);

    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(updateDoc(userDocRef, { [list]: arrayUnion(book) }));
  }

  addToRead(book: any): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return of(undefined);
    }

    const bookData = { id: book.id, pagesRead: book.pagesRead || 0 };
    const userDocRef = doc(this.firestore, 'users', this.userId);

    this.lists.currentlyReading = this.lists.currentlyReading.filter(
      (b) => b.id !== book.id
    );
    this.lists.read.push(bookData);
    this.listsSubject.next(this.lists);

    return from(
      updateDoc(userDocRef, {
        read: arrayUnion(bookData),
        currentlyReading: arrayRemove({ id: book.id }),
      })
    );
  }

  saveUserRating(bookId: string, rating: number): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte spara betyg.');
      return of(undefined);
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(updateDoc(userDocRef, { [`ratings.${bookId}`]: rating }));
  }

  saveUserReview(
    bookId: string,
    review: { rating: number; text: string }
  ): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte spara recension.');
      return of(undefined);
    }
    console.log(`Sparar recension för användare ${this.userId}, bok ${bookId}`);

    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(
      updateDoc(userDocRef, {
        [`reviews.${bookId}`]: review,
      })
    );
  }

  updateUserReview(
    bookId: string,
    review: { rating: number; text: string }
  ): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera recension.');
      return of(undefined);
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(updateDoc(userDocRef, { [`reviews.${bookId}`]: review }));
  }

  getUserReview(
    bookId: string
  ): Observable<{ rating: number; text: string } | null> {
    if (!this.userId) {
      return of(null);
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);
    return docData(userDocRef).pipe(
      map((data: any) => data?.reviews?.[bookId] ?? null)
    );
  }

  getLists(): Observable<BookList> {
    return this.listsSubject.asObservable();
  }

  get listsValue(): BookList {
    return this.listsSubject.getValue();
  }

  getCurrentlyReading(): Observable<any[]> {
    return this.getListObservable('currentlyReading');
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

  updatePagesRead(book: any, pagesRead: number): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return of(undefined);
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);

    this.lists.currentlyReading = this.lists.currentlyReading.map((b) =>
      b.id === book.id ? { ...b, pagesRead } : b
    );

    return from(
      updateDoc(userDocRef, {
        currentlyReading: this.lists.currentlyReading,
      }).then(() => {
        this.listsSubject.next(this.lists);
      })
    );
  }

  calculateProgress(book: any): number {
    if (!book.volumeInfo?.pageCount || book.volumeInfo.pageCount === 0)
      return 0;
    const progress = ((book.pagesRead ?? 0) / book.volumeInfo.pageCount) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  removeBookFromCurrentlyReading(bookId: string): Observable<void> {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return of(undefined);
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);

    this.lists.currentlyReading = this.lists.currentlyReading.filter(
      (b) => b.id !== bookId
    );
    this.listsSubject.next(this.lists);

    return from(
      updateDoc(userDocRef, {
        currentlyReading: arrayRemove({ id: bookId }),
      })
    );
  }

  getUserRating(bookId: string): Observable<number | null> {
    if (!this.userId) {
      return of(null);
    }

    const userDocRef = doc(this.firestore, 'users', this.userId);
    return docData(userDocRef).pipe(
      map((data: any) => data?.ratings?.[bookId] ?? null)
    );
  }
}
