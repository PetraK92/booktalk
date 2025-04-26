import { Component, OnInit } from '@angular/core';
import { BookListService } from '../services/book-list.service';
import { Observable, switchMap, of, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookService } from '../book.service';

@Component({
  selector: 'app-to-be-read',
  templateUrl: './to-be-read.component.html',
  styleUrls: ['./to-be-read.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent],
})
export class ToBeReadComponent implements OnInit {
  tbrBooks$!: Observable<any[]>;

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

        const bookObservables = tbrEntries.map((entry) =>
          this.bookService
            .getBookById(entry.id)
            .pipe
            // Kombinera in läst data om du vill senare
            ()
        );

        return forkJoin(bookObservables);
      })
    );
  }
}
