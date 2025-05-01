import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { PopularBooksComponent } from '../../components/popular-books/popular-books.component';
import { WelcomeMessageComponent } from '../../components/welcome-message/welcome-message.component';
import { RouterModule } from '@angular/router';
import { CurrentlyReadingComponent } from '../../components/currently-reading/currently-reading.component';
import { FormsModule } from '@angular/forms';
import { ReadBooksComponent } from '../../components/read-books/read-books.component';
import { ToBeReadComponent } from '../../components/to-be-read/to-be-read.component';

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
    ReadBooksComponent,
    ToBeReadComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
