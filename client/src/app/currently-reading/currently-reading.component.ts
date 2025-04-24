import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListService } from '../services/book-list.service';
import { AuthService } from '../app.auth.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-currently-reading',
  standalone: true,
  imports: [CommonModule],
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
}
