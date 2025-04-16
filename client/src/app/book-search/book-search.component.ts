import { Component } from '@angular/core';
import { BookService } from '../book.service';
import Fuse from 'fuse.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
})
export class BookSearchComponent {
  searchTerm: string = '';
  books: any[] = [];
  searchResults: any[] = [];
  fuse: any;

  constructor(private bookService: BookService) {}

  searchBooks() {
    if (!this.searchTerm.trim()) return;

    this.bookService.searchBooks(this.searchTerm).subscribe((res: any) => {
      this.books = res.items || [];
      this.searchResults = this.books;

      // Skapa Fuse.js instans
      this.fuse = new Fuse(this.books, {
        keys: ['volumeInfo.title', 'volumeInfo.authors'],
        threshold: 0.3,
      });

      // Fuzzy-sökning
      this.searchResults = this.fuse
        .search(this.searchTerm)
        .map((result: { item: any }) => result.item);
    });
  }
}
