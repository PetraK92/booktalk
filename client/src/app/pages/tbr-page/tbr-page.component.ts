import { Component, OnInit } from '@angular/core';
import { BookListService } from '../../services/book-list.service';
import { BookService } from '../../services/book.service';
import { Observable, of, forkJoin, switchMap } from 'rxjs';
import { BookDetails } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tbr-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tbr-page.component.html',
  styleUrls: ['./tbr-page.component.css'],
})
export class TbrPageComponent implements OnInit {
  allTbrBooks$!: Observable<BookDetails[]>;

  constructor(
    private bookListService: BookListService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.allTbrBooks$ = this.bookListService.getTbr().pipe(
      switchMap((entries) => {
        if (!entries || entries.length === 0) return of([]);
        const observables = entries.map((e) =>
          this.bookService.getBookById(e.id)
        );
        return forkJoin(observables);
      })
    );
  }
}
