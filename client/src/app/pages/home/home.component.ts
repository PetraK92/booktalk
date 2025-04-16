import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { PopularBooksComponent } from '../../popular-books/popular-books.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MainLayoutComponent, PopularBooksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
