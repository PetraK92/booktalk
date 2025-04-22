import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { PopularBooksComponent } from '../../popular-books/popular-books.component';
import { WelcomeMessageComponent } from '../../welcome-message/welcome-message.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    MainLayoutComponent,
    PopularBooksComponent,
    WelcomeMessageComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
