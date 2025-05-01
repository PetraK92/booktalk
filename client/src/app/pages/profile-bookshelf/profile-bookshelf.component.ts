import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-bookshelf',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-bookshelf.component.html',
  styleUrls: ['./profile-bookshelf.component.css'],
})
export class ProfileBookshelfComponent implements OnInit {
  private auth = inject(Auth);
  private userService = inject(UserService);

  books: any[] = [];
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.userService.getUser(user.uid).subscribe((data) => {
        if (data?.savedbooks) {
          this.books = data.savedbooks;
        }
      });
    }

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}
