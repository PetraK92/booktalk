import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { AvatarPickerComponent } from '../avatar-picker/avatar-picker.component';
import { RouterModule } from '@angular/router';
import { CurrentlyReadingComponent } from '../currently-reading/currently-reading.component';

interface UserData {
  username: string;
  avatar: string;
  currentlyreading?: string;
  savedbooks?: any[];
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarPickerComponent,
    RouterModule,
    CurrentlyReadingComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private auth = inject(Auth);
  private userService = inject(UserService);

  uid: string = '';
  username: string = '';
  avatar: string = '';
  userData: UserData | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      console.warn('Ingen användare inloggad');
      this.loading = false;
      return;
    }

    this.uid = currentUser.uid;

    this.userService
      .getUser(this.uid)
      .subscribe((data: UserData | undefined) => {
        if (data) {
          this.userData = data;
          this.username = data.username ?? '';
          this.avatar = data.avatar ?? '';
        } else {
          console.warn('Ingen användardata hittades');
        }
        this.loading = false;
      });
  }

  updateProfile() {
    if (!this.uid) return;

    const updatedData: Partial<UserData> = {
      username: this.username,
      avatar: this.avatar,
    };

    this.userService
      .updateUser(this.uid, updatedData)
      .then(() => alert('Profil uppdaterad!'))
      .catch((err) => alert('Fel vid uppdatering: ' + err.message));
  }
}
