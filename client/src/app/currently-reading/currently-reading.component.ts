import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../services/book-list.service';
import { AuthService } from '../app.auth.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';

@Component({
  selector: 'app-currently-reading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currently-reading.component.html',
  styleUrls: ['./currently-reading.component.css'],
})
export class CurrentlyReadingComponent implements OnInit {
  currentlyReadingBooks$!: Observable<any[]>;
  user$!: Observable<any | null>;

  constructor(
    private bookListService: BookListService,
    private authService: AuthService,
    private bookService: BookService
  ) {
    this.user$ = this.authService.user$;
  }

  // ngOnInit(): void {
  //   // this.currentlyReadingBooks$ = this.bookListService.getCurrentlyReading();

  //   // <-- change this:
  //   this.currentlyReadingBooks$ = this.bookListService.getLists().subscribe(async (lists) => {
  //     console.log('Now I really see the loaded books:', lists.currentlyReading);
  //     const test = await this.bookService.getBookById(
  //       lists.currentlyReading[0]
  //     );
  //     console.log('hej', test);
  //     return test;
  //   });
  // }
  // ngOnInit(): void {
  //   this.currentlyReadingBooks$ = this.bookListService
  //     .getLists()
  //     .pipe(
  //       map((lists) => lists.currentlyReading[0]), // pick the first ID
  //       filter((id) => !!id), // ignore empty
  //       switchMap((bookId) => this.bookService.getBookById(bookId))
  //     )
  //     .subscribe((bookDetail) => {
  //       console.log('Book detail:', bookDetail);
  //     });
  // }
  // ngOnInit(): void {
  //   this.currentlyReadingBooks$ = this.bookListService.getLists().pipe(
  //     // 1) pluck out the array of IDs
  //     map((lists) => lists.currentlyReading),

  //     // 2) whenever IDs change, turn them into an array of detail‐Observables
  //     switchMap((ids) => {
  //       if (!ids || ids.length === 0) {
  //         // no IDs → emit an empty array and complete
  //         return of([]);
  //       }
  //       // map each ID to an HTTP call
  //       const detailCalls = ids.map((id) => this.bookService.getBookById(id));
  //       // combineLatest will wait until every call has emitted, then produce an array
  //       return combineLatest(detailCalls);
  //     })
  //   );
  // }

  // ngOnInit() {
  //   this.currentlyReadingBooks$ = this.bookListService.getLists().pipe(
  //     map((lists) => lists.currentlyReading),
  //     switchMap((ids) => {
  //       if (!ids || ids.length === 0) return of([]);
  //       const detailCalls = ids.map((id) =>
  //         this.bookService
  //           .getBookById(id.id)
  //           .pipe(tap((book) => console.log('📚 book detail for', id, book)))
  //       );
  //       return combineLatest(detailCalls);
  //     })
  //   );
  // }
  ngOnInit() {
    this.currentlyReadingBooks$ = this.bookListService.getLists().pipe(
      map((lists) => lists.currentlyReading),
      switchMap((ids) => {
        if (!ids || ids.length === 0) return of([]);
        const detailCalls = ids.map((idObj) =>
          this.bookService.getBookById(idObj.id).pipe(
            map((bookDetail) => ({
              ...bookDetail, // all data från Google Books
              pagesRead: idObj.pagesRead || 0, // och lägg till pagesRead från Firestore
              id: idObj.id, // spara id också
            })),
            tap((book) => console.log('📚 book detail for', idObj, book))
          )
        );
        return combineLatest(detailCalls);
      })
    );
  }

  updatePagesRead(book: any, pagesRead: number) {
    this.bookListService.updatePagesRead(book, pagesRead);
  }

  // Metod för att beräkna progressen i %
  calculateProgress(book: any): number {
    return this.bookListService.calculateProgress(book);
  }

  markAsRead(book: any) {
    this.bookListService.addToRead(book);
    this.removeFromCurrentlyReading(book.id);
  }

  removeFromCurrentlyReading(book: { id: string; pagesRead: number }) {
    this.bookListService.removeFromCurrentlyReading({
      id: book.id,
      pagesRead: book.pagesRead,
    });
  }
}
