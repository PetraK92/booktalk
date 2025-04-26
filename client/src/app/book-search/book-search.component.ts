import { Component } from '@angular/core';
import { BookService } from '../book.service';
import Fuse from 'fuse.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BookCardComponent } from '../book-card/book-card.component';
import { filter, debounceTime, Subject } from 'rxjs';

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
  private searchSubject = new Subject<string>();

  constructor(private bookService: BookService, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.startsWith('/books/')) {
          this.searchResults = [];
          this.searchTerm = '';
        }
      });

    this.searchSubject.pipe(debounceTime(500)).subscribe((term) => {
      this.performSearch(term);
    });
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  performSearch(term: string) {
    if (!term.trim()) {
      this.searchResults = [];
      return;
    }

    this.bookService.searchBooks(term).subscribe((res: any) => {
      this.books = res.items || [];
      console.log('här är vi', res.items);
      this.fuse = new Fuse(this.books, {
        keys: ['volumeInfo.title', 'volumeInfo.authors'],
        threshold: 0.3,
      });

      this.searchResults = this.fuse
        .search(term)
        .map((result: { item: any }) => result.item);
    });
  }

  searchBooks() {
    this.onSearchChange(this.searchTerm);
  }
}
