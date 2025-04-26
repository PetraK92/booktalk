import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../services/book-list.service';
import { AuthService } from '../app.auth.service';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currently-reading',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.currentlyReadingBooks$ = this.bookListService
      .getLists()
      .pipe(map((lists) => lists.currentlyReading));
  }

  updatePagesRead(book: any, pagesRead: number) {
    this.bookListService.updatePagesRead(book, pagesRead);
  }

  // Metod för att beräkna progressen i %
  calculateProgress(book: any): number {
    return this.bookListService.calculateProgress(book);
  }

  markAsRead(book: any) {
    this.bookListService.addToRead(book);
    this.removeFromCurrentlyReading(book.id);
  }

  removeFromCurrentlyReading(bookId: string) {
    this.bookListService.removeBookFromCurrentlyReading(bookId);
  }
}
