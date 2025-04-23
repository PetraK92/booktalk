import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-profile-bookshelf',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-bookshelf">
      <h2>Min bokhylla</h2>
      <p *ngIf="!books.length">Inga böcker hittade.</p>
      <ul *ngIf="books.length">
        <li *ngFor="let book of books">{{ book.title }}</li>
      </ul>
    </div>
  `,
  styles: [
    `
      .profile-bookshelf {
        padding: 2rem;
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
