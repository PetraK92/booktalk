import { Component } from '@angular/core';
import { BookService } from '../book.service';
import Fuse from 'fuse.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BookCardComponent } from '../book-card/book-card.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BookCardComponent],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
})
export class BookSearchComponent {
  searchTerm: string = '';
  books: any[] = [];
  searchResults: any[] = [];
  fuse: any;

  constructor(private bookService: BookService, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.startsWith('/books/')) {
          this.searchResults = [];
          this.searchTerm = '';
        }
      });
  }

  searchBooks() {
    if (!this.searchTerm.trim()) return;

    this.bookService.searchBooks(this.searchTerm).subscribe((res: any) => {
      this.books = res.items || [];
      this.searchResults = this.books;

      this.fuse = new Fuse(this.books, {
        keys: ['volumeInfo.title', 'volumeInfo.authors'],
        threshold: 0.3,
      });

      this.searchResults = this.fuse
        .search(this.searchTerm)
        .map((result: { item: any }) => result.item);
    });
  }
}
