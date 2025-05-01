import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/app.auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.css'],
})
export class WelcomeMessageComponent {
  authService = inject(AuthService);
  user$ = this.authService.user$;

  username: string = '';

  constructor() {
    this.user$.subscribe((user: User | null) => {
      if (user) {
        this.username = user.displayName || user.email || 'Guest';
      } else {
        this.username = 'Guest';
      }
    });
  }
}
