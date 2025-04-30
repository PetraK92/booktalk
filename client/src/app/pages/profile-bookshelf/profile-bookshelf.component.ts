import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-bookshelf',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-bookshelf.component.html', // Referens till HTML-fil
  styleUrls: ['./profile-bookshelf.component.css'], // Referens till CSS-fil
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

    // Lyssna på ruttförändringar för att uppdatera aktuell väg
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  // Funktion för att kolla om den aktuella vägen är aktiv
  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}
