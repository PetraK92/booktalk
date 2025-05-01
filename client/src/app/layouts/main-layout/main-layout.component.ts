import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BookSearchComponent } from '../../components/book-search/book-search.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthComponent } from '../../components/auth/auth.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [BookSearchComponent, RouterOutlet, RouterModule, AuthComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements AfterViewInit {
  @ViewChild('authComponent') authComponent!: AuthComponent;

  constructor() {}

  ngAfterViewInit() {
    console.log(this.authComponent);
  }
}
