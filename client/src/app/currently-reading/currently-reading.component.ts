import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../services/book-list.service';
import { AuthService } from '../app.auth.service';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Lägg till FormsModule här

@Component({
  selector: 'app-currently-reading',
  standalone: true,
  imports: [CommonModule, FormsModule], // Lägg till FormsModule i imports
  templateUrl: './currently-reading.component.html',
  styleUrls: ['./currently-reading.component.css'],
})
export class CurrentlyReadingComponent implements OnInit {
  currentlyReadingBooks$!: Observable<any[]>;

  constructor(
    private bookListService: BookListService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentlyReadingBooks$ = this.bookListService.getLists().pipe(
      // plockar bara ut "currentlyReading"
      map((lists) => lists.currentlyReading)
    );
  }

  // Metod för att uppdatera lästa sidor när användaren ändrar det i inputfältet
  updatePagesRead(book: any, pagesRead: number) {
    // Uppdatera antalet lästa sidor för den aktuella boken
    this.bookListService.updatePagesRead(book, pagesRead);
  }

  // Metod för att beräkna progressen i %
  calculateProgress(book: any): number {
    return this.bookListService.calculateProgress(book);
  }
}
