import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Fuse from 'fuse.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  searchBooks() {
    if (!this.searchTerm.trim()) return;

    // Dela upp sökterm på komma om författare finns
    const searchParts = this.searchTerm.split(',');
    const title = encodeURIComponent(searchParts[0].trim()); // Titel
    const author = searchParts[1]
      ? `+inauthor:${encodeURIComponent(searchParts[1].trim())}`
      : ''; // Författare om det finns

    // Bygg URL från environment.ts
    const url = `${environment.googleBooksApi.baseUrl}intitle:${title}${author}&maxResults=${environment.googleBooksApi.maxResults}`;

    this.http.get(url).subscribe((res: any) => {
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
