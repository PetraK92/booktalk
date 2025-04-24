import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
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

  // Lägg till bok i Firestore och uppdatera lokalt
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

  // Returnera alla listor som Observable
  getLists(): Observable<BookList> {
    return this.listsSubject.asObservable();
  }

  // Hämtar aktuell lista från Firestore direkt som Observable
  getCurrentlyReading(): Observable<any[]> {
    return this.getListObservable('currentlyReading');
  }

  getTbr(): Observable<any[]> {
    return this.getListObservable('tbr');
  }

  getRead(): Observable<any[]> {
    return this.getListObservable('read');
  }

  // Hjälpmetod för att hämta en lista baserat på namn
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

  // Uppdatera antalet lästa sidor för en bok
  async updatePagesRead(book: any, pagesRead: number) {
    if (!this.userId) {
      console.error('Ingen användare inloggad – kan inte uppdatera Firestore.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);

      // Uppdatera den aktuella boken med det nya antal sidor som har lästs
      this.lists.currentlyReading = this.lists.currentlyReading.map((b) =>
        b.title === book.title ? { ...b, pagesRead } : b
      );

      // Uppdatera Firestore
      await updateDoc(userDocRef, {
        currentlyReading: this.lists.currentlyReading,
      });

      // Uppdatera lokala listor (för UI)
      this.listsSubject.next(this.lists);
    } catch (error) {
      console.error('Kunde inte uppdatera Firestore:', error);
    }
  }

  // Beräkna progressen för en bok i procent
  calculateProgress(book: any): number {
    if (!book.pageCount || book.pageCount === 0) return 0;
    const progress = (book.pagesRead / book.pageCount) * 100;

    // Begränsa progressen till mellan 0 och 100
    return Math.min(Math.max(progress, 0), 100);
  }
}
