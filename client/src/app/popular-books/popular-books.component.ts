import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
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
