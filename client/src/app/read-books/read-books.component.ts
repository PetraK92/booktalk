import { Component, OnInit } from '@angular/core';
import { BookListService } from '../services/book-list.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookDetailsComponent } from '../pages/book-details/book-details.component';

@Component({
  selector: 'app-read-books',
  templateUrl: './read-books.component.html',
  styleUrls: ['./read-books.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookCardComponent,
    BookDetailsComponent,
  ],
})
export class ReadBooksComponent implements OnInit {
  readBooks$!: Observable<any[]>;

  constructor(private bookListService: BookListService) {}

  ngOnInit(): void {
    this.readBooks$ = this.bookListService.getRead();
    this.readBooks$.subscribe((books) => {
      console.log(books);
    });
  }
}
