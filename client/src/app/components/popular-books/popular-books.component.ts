import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookDetails } from '../../models/book.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-popular-books',
  templateUrl: './popular-books.component.html',
  styleUrls: ['./popular-books.component.css'],
})
export class PopularBooksComponent implements OnInit {
  popularBooks: GoogleBookItem[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.searchPopularBooks().subscribe((res: GoogleBookItem[]) => {
      this.popularBooks = res || [];
      console.log(this.popularBooks);
    });
  }
}
export interface GoogleBooksApiResponse {
  items: GoogleBookItem[];
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: BookDetails['volumeInfo'];
}
