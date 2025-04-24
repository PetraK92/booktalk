import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../book.service';
import { BookListService } from '../../services/book-list.service'; // Lägg till denna import
import { BookDetails } from './book.model';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  bookId: string = '';
  bookDetails: BookDetails | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookListService: BookListService // Lägg till denna service
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.bookId = id;
            return this.bookService.getBookById(id);
          } else {
            this.errorMessage = 'Ingen bok-ID hittades.';
            throw new Error('No book ID provided');
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.volumeInfo) {
            this.bookDetails = response.volumeInfo;
          } else {
            this.errorMessage = 'Felaktiga bokdetaljer mottogs.';
          }
        },
        error: (err) => {
          console.error('Fel vid hämtning av bokdetaljer:', err);
          this.errorMessage = 'Kunde inte hämta bokdetaljer.';
        },
      });
  }

  // Funktion för att lägga till boken i olika listor
  addToList(list: 'currentlyReading' | 'tbr' | 'read') {
    if (this.bookDetails) {
      this.bookListService.addToList(list, this.bookDetails); // Skicka hela bokobjektet
    }
  }
}
