import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/app.auth.service';
import { Firestore, docData, doc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  userData: any = null;
  private subscriptions = new Subscription();

  ngOnInit() {
    const userSub = this.authService.user$.subscribe((user) => {
      if (user?.uid) {
        const userRef = doc(this.firestore, 'users', user.uid);
        const docSub = docData(userRef).subscribe((data) => {
          this.userData = { ...data, email: user.email };
        });
        this.subscriptions.add(docSub);
      }
    });

    this.subscriptions.add(userSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
