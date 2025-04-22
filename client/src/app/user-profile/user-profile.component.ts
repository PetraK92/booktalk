import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private auth = inject(Auth);
  private userService = inject(UserService);

  uid: string = '';
  username: string = '';
  avatar: string = '';
  userData: any = null;

  ngOnInit(): void {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      this.uid = currentUser.uid;

      this.userService.getUser(this.uid).subscribe((data) => {
        this.userData = data;
        this.username = data.username;
        this.avatar = data.avatar;
      });
    } else {
      console.warn('Ingen användare inloggad');
    }
  }

  updateProfile() {
    if (this.uid) {
      this.userService
        .updateUser(this.uid, {
          username: this.username,
          avatar: this.avatar,
        })
        .then(() => alert('Profil uppdaterad!'))
        .catch((err) => alert('Fel vid uppdatering: ' + err.message));
    }
  }
}
