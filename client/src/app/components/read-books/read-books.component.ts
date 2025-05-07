import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BookListService } from '../../services/book-list.service';
import { Observable, of, combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { switchMap, map } from 'rxjs/operators';
import { BookWithProgress } from '../../models/book.model';

@Component({
  selector: 'app-read-books',
  templateUrl: './read-books.component.html',
  styleUrls: ['./read-books.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadBooksComponent implements OnInit {
  readBooks$!: Observable<BookWithProgress[]>;

  constructor(
    private bookListService: BookListService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.readBooks$ = this.bookListService.getRead().pipe(
      switchMap((books) => {
        if (!books || books.length === 0) return of([]);
        const detailCalls = books.map((b) =>
          this.bookService.getBookById(b.id).pipe(
            map(
              (bookDetail): BookWithProgress => ({
                ...bookDetail,
                id: b.id,
                pagesRead: b.pagesRead || 0,
                totalPages: bookDetail.volumeInfo.pageCount || 0,
              })
            )
          )
        );
        return combineLatest(detailCalls);
      }),
      map((books) => books.slice(0, 5))
    );
  }
}
