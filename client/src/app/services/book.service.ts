import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {
  catchError,
  map,
  retryWhen,
  delay,
  take,
  mergeMap,
} from 'rxjs/operators';
import { environment } from '../../environments/environment';
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

  private retryRequest<T>(maxRetries: number, delayMs: number) {
    return (source: Observable<T>) =>
      source.pipe(
        retryWhen((errors) =>
          errors.pipe(
            mergeMap((error, count) => {
              if (count >= maxRetries || error.status !== 429) {
                return throwError(error);
              }
              return of(error).pipe(delay(delayMs));
            }),
            take(maxRetries)
          )
        )
      );
  }

  searchBooks(searchTerm: string): Observable<GoogleBookItem[]> {
    if (!searchTerm.trim()) return of([]);

    const searchParts = searchTerm.split(',');
    const title = encodeURIComponent(searchParts[0].trim());
    const author = searchParts[1]
      ? `+inauthor:${encodeURIComponent(searchParts[1].trim())}`
      : '';

    const url = `${environment.googleBooksApi.baseUrl}intitle:${title}${author}&maxResults=${environment.googleBooksApi.maxResults}`;

    return this.http.get<{ items: GoogleBookItem[] }>(url).pipe(
      this.retryRequest(3, 2000),
      map((response) => response.items || []),
      catchError(this.handleError)
    );
  }

  searchPopularBooks(): Observable<GoogleBookItem[]> {
    const url = `${environment.googleBooksApi.baseUrl}subject:fiction&orderBy=newest&maxResults=5`;
    return this.http.get<GoogleBooksApiResponse>(url).pipe(
      this.retryRequest(3, 2000),
      map((response) => response.items || []),
      catchError(this.handleError)
    );
  }

  getBookById(bookId: string): Observable<ReadBookDetails> {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    return this.http.get<GoogleBookItem>(url).pipe(
      this.retryRequest(3, 2000),
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
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 429) {
      console.error('Too many requests - Please try again later.');
    } else if (error.status === 500) {
      console.error('Server error. Please try again later.');
    } else {
      console.error('Error occurred:', error.message);
    }
    return throwError(error);
  }
}
