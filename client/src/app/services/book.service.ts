import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import {
  BookDetails,
  BookListItem,
  GoogleBooksApiResponse,
  GoogleBookItem,
  ReadBookDetails,
} from './../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  searchBooks(searchTerm: string): Observable<GoogleBookItem[]> {
    if (!searchTerm.trim()) return of([]);

    const searchParts = searchTerm.split(',');
    const title = encodeURIComponent(searchParts[0].trim());
    const author = searchParts[1]
      ? `+inauthor:${encodeURIComponent(searchParts[1].trim())}`
      : '';

    const url = `${environment.googleBooksApi.baseUrl}intitle:${title}${author}&maxResults=${environment.googleBooksApi.maxResults}`;
    return this.http
      .get<{ items: GoogleBookItem[] }>(url)
      .pipe(map((response) => response.items || []));
  }

  searchPopularBooks(): Observable<GoogleBookItem[]> {
    // Ändra denna metod att returnera en lista direkt
    const url = `${environment.googleBooksApi.baseUrl}subject:fiction&orderBy=newest&maxResults=5`;
    return this.http
      .get<GoogleBooksApiResponse>(url)
      .pipe(map((response) => response.items || [])); // returnera direkt response.items
  }

  getBookById(bookId: string): Observable<ReadBookDetails> {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    return this.http.get<GoogleBookItem>(url).pipe(
      map((response) => {
        const book = response.volumeInfo;

        if (!book) {
          return {
            id: bookId,
            volumeInfo: {
              title: '',
              authors: [],
              pageCount: 0,
              imageLinks: {},
            },
            pagesRead: 0,
            userRating: null,
            reviewText: '',
            reviewFull: false,
            totalPages: 0,
          } as ReadBookDetails;
        }

        return {
          id: bookId,
          volumeInfo: book,
          pagesRead: 0,
          userRating: null,
          reviewText: '',
          reviewFull: false,
          totalPages: book.pageCount || 0,
        } as ReadBookDetails;
      })
    );
  }
}
