import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BookSearchComponent } from '../../book-search/book-search.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthComponent } from '../../auth/auth.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [BookSearchComponent, RouterOutlet, RouterModule, AuthComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements AfterViewInit {
  @ViewChild('authComponent') authComponent!: AuthComponent; // Referens till AuthComponent

  constructor() {}

  ngAfterViewInit() {
    // Det är här vi kan använda authComponent för att anropa metoder från AuthComponent
    console.log(this.authComponent);
  }
}
