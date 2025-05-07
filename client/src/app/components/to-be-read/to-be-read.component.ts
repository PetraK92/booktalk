import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BookListService } from '../../services/book-list.service';
import { Observable, switchMap, of, forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { BookDetails } from '../../models/book.model';

@Component({
  selector: 'app-to-be-read',
  templateUrl: './to-be-read.component.html',
  styleUrls: ['./to-be-read.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToBeReadComponent implements OnInit {
  tbrBooks$!: Observable<BookDetails[]>;

  constructor(
    private bookListService: BookListService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.tbrBooks$ = this.bookListService.getTbr().pipe(
      switchMap((tbrEntries) => {
        if (!tbrEntries || tbrEntries.length === 0) {
          return of([]);
        }

        const limitedEntries = tbrEntries.slice(0, 5);

        const bookObservables = limitedEntries.map((entry) =>
          this.bookService.getBookById(entry.id).pipe(
            map(
              (bookDetail: BookDetails): BookDetails => ({
                ...bookDetail,
                id: entry.id,
              })
            )
          )
        );

        return forkJoin(bookObservables);
      })
    );
  }
}
