import { Component, OnInit } from '@angular/core';
import { BookListService } from '../services/book-list.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-to-be-read',
  templateUrl: './to-be-read.component.html',
  styleUrls: ['./to-be-read.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent],
})
export class ToBeReadComponent implements OnInit {
  tbrBooks$!: Observable<any[]>;

  constructor(private bookListService: BookListService) {}

  ngOnInit(): void {
    this.tbrBooks$ = this.bookListService.getTbr();
  }
}
