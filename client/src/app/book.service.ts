import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  searchBooks(searchTerm: string): Observable<any> {
    if (!searchTerm.trim()) return new Observable();

    const searchParts = searchTerm.split(',');
    const title = encodeURIComponent(searchParts[0].trim());
    const author = searchParts[1]
      ? `+inauthor:${encodeURIComponent(searchParts[1].trim())}`
      : '';

    const url = `${environment.googleBooksApi.baseUrl}intitle:${title}${author}&maxResults=${environment.googleBooksApi.maxResults}`;
    return this.http.get(url);
  }

  searchPopularBooks(): Observable<any> {
    const url = `${environment.googleBooksApi.baseUrl}subject:fiction&orderBy=newest&maxResults=5`;
    return this.http.get(url);
  }

  getBookById(bookId: string): Observable<any> {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) => (response.items ? response.items[0] : response))
      );
  }
}
