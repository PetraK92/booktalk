import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import Fuse from 'fuse.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, debounceTime, Subject } from 'rxjs';
import { BookListItem } from '../../models/book.model';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
})
export class BookSearchComponent {
  searchTerm: string = '';
  books: BookListItem[] = [];
  searchResults: BookListItem[] = [];
  fuse!: Fuse<BookListItem>;
  private searchSubject = new Subject<string>();

  @ViewChild('searchInput') searchInput: ElementRef | undefined;

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

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (
      this.searchInput &&
      !this.searchInput.nativeElement.contains(event.target)
    ) {
      this.searchResults = [];
      this.searchTerm = '';
    }
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  performSearch(term: string) {
    if (!term.trim()) {
      this.searchResults = [];
      return;
    }

    this.bookService.searchBooks(term).subscribe((res: BookListItem[]) => {
      console.log('Sökresultat:', res); // Loggar hela svaret från API

      this.books = res;

      // Logga bildlänkar, titel och författare för att se om det saknas något
      this.books.forEach((book) => {
        console.log('Bok data:', book);
        console.log('Titel:', book?.volumeInfo?.title);
        console.log('Författare:', book?.volumeInfo?.authors);
        console.log('Bildlänk:', book?.volumeInfo?.imageLinks?.thumbnail);
      });

      this.fuse = new Fuse(this.books, {
        keys: ['volumeInfo.title', 'volumeInfo.authors'],
        threshold: 0.3,
      });

      this.searchResults = this.fuse.search(term).map((result) => result.item);
    });
  }

  searchBooks() {
    this.onSearchChange(this.searchTerm);
  }
}
