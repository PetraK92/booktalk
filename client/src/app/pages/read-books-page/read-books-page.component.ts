import { Component, OnInit } from '@angular/core';
import { BookListService } from '../../services/book-list.service';
import { Observable, of, combineLatest, switchMap, map } from 'rxjs';
import { BookService } from '../../services/book.service';
import { ReadBookDetails } from '../../models/book.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-read-books-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './read-books-page.component.html',
  styleUrls: ['./read-books-page.component.css'],
})
export class ReadBooksPageComponent implements OnInit {
  readBooks$!: Observable<ReadBookDetails[]>;

  constructor(
    private bookListService: BookListService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.readBooks$ = this.bookListService.getRead().pipe(
      switchMap((books) => {
        if (!books || books.length === 0) return of([]);

        const detailCalls = books.map((b) =>
          combineLatest([
            this.bookService.getBookById(b.id),
            this.bookListService.getUserReview(b.id),
          ]).pipe(
            map(([bookDetail, userReview]) => ({
              ...bookDetail,
              id: b.id,
              pagesRead: b.pagesRead || 0,
              totalPages: b.totalPages || 0,
              userRating: userReview?.rating ?? null,
              reviewText: userReview?.text || 'No review available',
              reviewFull: false,
            }))
          )
        );

        return combineLatest(detailCalls);
      })
    );
  }

  toggleReview(book: ReadBookDetails): void {
    book.reviewFull = !book.reviewFull;
  }
}
