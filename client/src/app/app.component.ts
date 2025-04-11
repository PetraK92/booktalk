import { Component } from '@angular/core';
import { BookSearchComponent } from './book-search/book-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookSearchComponent],
  template: `<app-book-search></app-book-search>`,
})
export class AppComponent {}
