import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app.auth.service';
import { Firestore, docData, doc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-settings" *ngIf="userData">
      <h2>Settings</h2>
      <p>E-post: {{ userData.email }}</p>
      <!-- Lägg till formulärfält och logik för att uppdatera t.ex. användarnamn eller avatar -->
    </div>
    <p *ngIf="!userData">
      Du måste vara inloggad för att se dina inställningar.
    </p>
  `,
  styles: [
    `
      .profile-settings {
        padding: 2rem;
      }
    `,
  ],
})
export class ProfileSettingsComponent implements OnInit {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  userData: any = null;
  private userSub?: Subscription;

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      if (user?.uid) {
        const userRef = doc(this.firestore, 'users', user.uid);
        docData(userRef).subscribe((data) => {
          this.userData = { ...data, email: user.email };
        });
      }
    });
  }
}
