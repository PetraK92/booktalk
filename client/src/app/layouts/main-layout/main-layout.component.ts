import { Component } from '@angular/core';
import { BookSearchComponent } from '../../book-search/book-search.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthComponent } from '../../auth/auth.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [BookSearchComponent, RouterOutlet, RouterModule, AuthComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
