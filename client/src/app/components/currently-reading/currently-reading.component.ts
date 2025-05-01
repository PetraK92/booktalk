import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../../services/book-list.service';
import { AuthService } from '../../services/app.auth.service';
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
import { BookService } from '../../services/book.service';

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

  ngOnInit() {
    this.currentlyReadingBooks$ = this.bookListService.getLists().pipe(
      map((lists) => lists.currentlyReading),
      switchMap((ids) => {
        if (!ids || ids.length === 0) return of([]);
        const detailCalls = ids.map((idObj) =>
          this.bookService.getBookById(idObj.id).pipe(
            map((bookDetail) => ({
              ...bookDetail,
              pagesRead: idObj.pagesRead || 0,
              id: idObj.id,
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

  calculateProgress(book: any): number {
    return this.bookListService.calculateProgress(book);
  }

  markAsRead(book: any) {
    this.bookListService.addToRead(book);
    this.removeFromCurrentlyReading(book.id);
  }

  removeFromCurrentlyReading(book: { id: string; pagesRead: number }) {
    this.bookListService.removeBookFromCurrentlyReading(book.id);
  }
}
