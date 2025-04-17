import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../book-card/book-card.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent],
  selector: 'app-popular-books',
  templateUrl: './popular-books.component.html',
  styleUrls: ['./popular-books.component.css'],
})
export class PopularBooksComponent implements OnInit {
  popularBooks: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.searchPopularBooks().subscribe((res: any) => {
      this.popularBooks = res.items || [];
    });
  }
}
