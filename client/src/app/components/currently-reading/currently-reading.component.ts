import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../../services/book-list.service';
import { AuthService } from '../../services/app.auth.service';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { BookWithProgress } from '../../models/book.model';

@Component({
  selector: 'app-currently-reading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currently-reading.component.html',
  styleUrls: ['./currently-reading.component.css'],
})
export class CurrentlyReadingComponent implements OnInit {
  currentlyReadingBooks$!: Observable<BookWithProgress[]>;
  user$!: Observable<unknown>;

  constructor(
    private bookListService: BookListService,
    private authService: AuthService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user$;

    this.currentlyReadingBooks$ = this.bookListService.getLists().pipe(
      map((lists) => lists.currentlyReading),
      switchMap((ids) => {
        if (!ids || ids.length === 0) return of([]);
        const detailCalls = ids.map((idObj) =>
          this.bookService.getBookById(idObj.id).pipe(
            map(
              (bookDetail): BookWithProgress => ({
                ...bookDetail,
                pagesRead: idObj.pagesRead || 0,
                id: idObj.id,
                totalPages: bookDetail.volumeInfo?.pageCount || 0,
              })
            ),
            tap((book) => console.log('📚 book detail for', idObj, book))
          )
        );
        return combineLatest(detailCalls);
      })
    );
  }

  updatePagesRead(book: BookWithProgress, pagesRead: number) {
    this.bookListService.updatePagesRead(book, pagesRead);
  }

  calculateProgress(book: BookWithProgress): number {
    return this.bookListService.calculateProgress(book);
  }

  markAsRead(book: BookWithProgress) {
    this.bookListService.addToRead(book);
    this.removeFromCurrentlyReading(book.id);
  }

  removeFromCurrentlyReading(bookId?: string) {
    if (!bookId) return;
    this.bookListService.removeBookFromCurrentlyReading(bookId);
  }
}
