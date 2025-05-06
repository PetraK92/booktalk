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
  DocumentData,
} from '@angular/fire/firestore';
import { AuthService } from './app.auth.service';
import { switchMap, map } from 'rxjs/operators';
import {
  BookDetails,
  BookWithProgress,
  ReadBookDetails,
  Review,
} from '../models/book.model';

interface BookList {
  currentlyReading: BookWithProgress[];
  tbr: BookDetails[];
  read: ReadBookDetails[];
}

interface UserData {
  currentlyReading?: BookWithProgress[];
  tbr?: BookDetails[];
  read?: ReadBookDetails[];
  ratings?: Record<string, number>;
  reviews?: Record<string, Review>;
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
      this.userId = user?.uid ?? null;
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
      const data = docSnapshot.data() as UserData;
      this.lists.currentlyReading = data.currentlyReading ?? [];
      this.lists.tbr = data.tbr ?? [];
      this.lists.read = data.read ?? [];
      this.listsSubject.next(this.lists);
    }
  }

  addToList(list: keyof BookList, book: BookDetails): Observable<void> {
    if (!this.userId) return of(undefined);
    this.lists[list].push(book as any);
    this.listsSubject.next(this.lists);
    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(updateDoc(userDocRef, { [list]: arrayUnion(book) }));
  }

  addToRead(book: BookWithProgress): Observable<void> {
    if (!this.userId) return of(undefined);
    const bookData: ReadBookDetails = {
      ...book,
      userRating: null,
      reviewText: '',
      reviewFull: false,
    };
    const userDocRef = doc(this.firestore, 'users', this.userId);

    this.lists.currentlyReading = this.lists.currentlyReading.filter(
      (b) => b.id !== book.id
    );
    this.lists.read.push(bookData);
    this.listsSubject.next(this.lists);

    return from(
      updateDoc(userDocRef, {
        read: arrayUnion(bookData),
        currentlyReading: arrayRemove(book),
      })
    );
  }

  saveUserRating(bookId: string, rating: number): Observable<void> {
    if (!this.userId) return of(undefined);
    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(updateDoc(userDocRef, { [`ratings.${bookId}`]: rating }));
  }

  saveUserReview(bookId: string, review: Review): Observable<void> {
    if (!this.userId) return of(undefined);
    const userDocRef = doc(this.firestore, 'users', this.userId);
    return from(updateDoc(userDocRef, { [`reviews.${bookId}`]: review }));
  }

  updateUserReview(bookId: string, review: Review): Observable<void> {
    return this.saveUserReview(bookId, review);
  }

  getUserReview(bookId: string): Observable<Review | null> {
    if (!this.userId) return of(null);
    const userDocRef = doc(this.firestore, 'users', this.userId);
    return docData(userDocRef).pipe(
      map((data) => (data as UserData)?.reviews?.[bookId] ?? null)
    );
  }

  getUserRating(bookId: string): Observable<number | null> {
    if (!this.userId) return of(null);
    const userDocRef = doc(this.firestore, 'users', this.userId);
    return docData(userDocRef).pipe(
      map((data) => (data as UserData)?.ratings?.[bookId] ?? null)
    );
  }

  getLists(): Observable<BookList> {
    return this.listsSubject.asObservable();
  }

  get listsValue(): BookList {
    return this.listsSubject.getValue();
  }

  getCurrentlyReading(): Observable<BookWithProgress[]> {
    return this.getListObservable('currentlyReading');
  }

  getTbr(): Observable<BookDetails[]> {
    return this.getListObservable('tbr').pipe(
      map((tbrEntries) =>
        tbrEntries.map((entry) => ({
          ...entry,
          totalPages: entry.volumeInfo?.pageCount ?? 0,
        }))
      )
    );
  }

  getRead(): Observable<ReadBookDetails[]> {
    return this.getListObservable('read');
  }

  private getListObservable<K extends keyof BookList>(
    listName: K
  ): Observable<BookList[K]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([] as BookList[K]);
        const userDocRef = doc(this.firestore, 'users', user.uid);
        return docData(userDocRef).pipe(
          map((data) => ((data as UserData)?.[listName] ?? []) as BookList[K])
        );
      })
    );
  }

  updatePagesRead(book: BookWithProgress, pagesRead: number): Observable<void> {
    if (!this.userId) return of(undefined);
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

  calculateProgress(book: BookWithProgress): number {
    const totalPages = book.totalPages || book.volumeInfo?.pageCount || 0;
    const progress = ((book.pagesRead ?? 0) / totalPages) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  removeBookFromCurrentlyReading(bookId: string): Observable<void> {
    if (!this.userId) return of(undefined);
    const userDocRef = doc(this.firestore, 'users', this.userId);
    const bookToRemove = this.lists.currentlyReading.find(
      (b) => b.id === bookId
    );
    if (!bookToRemove) return of(undefined);

    this.lists.currentlyReading = this.lists.currentlyReading.filter(
      (b) => b.id !== bookId
    );
    this.listsSubject.next(this.lists);

    return from(
      updateDoc(userDocRef, {
        currentlyReading: arrayRemove(bookToRemove),
      })
    );
  }
}
