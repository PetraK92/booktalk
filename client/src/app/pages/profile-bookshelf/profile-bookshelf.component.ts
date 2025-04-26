import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-bookshelf',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bookshelf-container">
      <h2>My Bookshelf</h2>

      <nav class="bookshelf-nav">
        <a routerLink="read-books" routerLinkActive="active">Read Books</a>
        <a routerLink="tbr" routerLinkActive="active">To Be Read</a>
      </nav>

      <!-- Router outlet för att visa de respektive listorna här -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .bookshelf-container {
        padding: 2rem;
      }
      .bookshelf-nav a {
        margin-right: 1rem;
        font-size: 18px;
        text-decoration: none;
      }
      .active {
        font-weight: bold;
        color: #007bff;
      }
    `,
  ],
})
export class ProfileBookshelfComponent implements OnInit {
  private auth = inject(Auth);
  private userService = inject(UserService);

  books: any[] = [];

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.userService.getUser(user.uid).subscribe((data) => {
        if (data?.savedbooks) {
          this.books = data.savedbooks;
        }
      });
    }
  }
}
