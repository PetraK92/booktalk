import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../app.auth.service'; // importera din AuthService
import { User } from 'firebase/auth'; // importera Firebase User-typ

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.css'],
})
export class WelcomeMessageComponent {
  authService = inject(AuthService);
  user$ = this.authService.user$; // vi lyssnar på authState i AuthService

  // Ingen extra kod behövs för att visa användarens data
}
