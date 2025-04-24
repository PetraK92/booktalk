import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { PopularBooksComponent } from '../../popular-books/popular-books.component';
import { WelcomeMessageComponent } from '../../welcome-message/welcome-message.component';
import { RouterModule } from '@angular/router';
import { CurrentlyReadingComponent } from '../../currently-reading/currently-reading.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    MainLayoutComponent,
    PopularBooksComponent,
    WelcomeMessageComponent,
    RouterModule,
    CurrentlyReadingComponent,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
