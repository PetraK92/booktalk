import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../../services/book-list.service';
import { AuthService } from '../../services/app.auth.service';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { BookWithProgress } from '../../models/book.model';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-currently-reading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currently-reading.component.html',
  styleUrls: ['./currently-reading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentlyReadingComponent implements OnInit {
  currentlyReadingBooks$!: Observable<BookWithProgress[]>;

  constructor(
    private bookListService: BookListService,
    private authService: AuthService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
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

    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        this.router.url.includes('currently-reading')
      ) {
        this.bookListService.loadUserLists();
      }
    });
  }

  updatePagesRead(book: BookWithProgress, pagesRead: number) {
    this.bookListService.updatePagesRead(book, pagesRead);
  }

  calculateProgress(book: BookWithProgress): number {
    return this.bookListService.calculateProgress(book);
  }

  markAsRead(book: BookWithProgress) {
    this.bookListService.addToRead(book).subscribe({
      next: () => {
        this.removeFromCurrentlyReading(book.id);
      },
      error: (err) => {
        console.error('Fel vid flytt av bok till "read":', err);
      },
    });
  }

  removeFromCurrentlyReading(bookId?: string) {
    if (!bookId) return;
    this.bookListService.removeBookFromCurrentlyReading(bookId);
  }
}
