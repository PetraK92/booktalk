import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReadBooksComponent } from '../../read-books/read-books.component';
import { ProfileLayoutComponent } from '../../layouts/profile-layout/profile-layout.component';

@Component({
  selector: 'app-read-books-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReadBooksComponent,
    ProfileLayoutComponent,
  ],
  template: `<app-read-books></app-read-books>`,
  styleUrls: ['./read-books-page.component.css'],
})
export class ReadBooksPageComponent {}
