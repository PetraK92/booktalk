import { Component } from '@angular/core';
import { AuthService } from '../app.auth.service';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  docData,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class AuthComponent {
  email = '';
  password = '';
  isLoginMode = true;

  constructor(private authService: AuthService, private firestore: Firestore) {}

  onSubmit() {
    if (this.isLoginMode) {
      this.authService
        .login(this.email, this.password)
        .then((res) => {
          console.log('Inloggad:', res.user?.email);
          // After a successful login, fetch the user document from Firestore.
          if (res.user && res.user.uid) {
            const userRef = doc(this.firestore, 'users', res.user.uid);
            // Subscribe to the document data; add { idField: 'uid' } if you want the uid merged into the data.
            docData(userRef, { idField: 'uid' }).subscribe((userData) => {
              console.log('Fetched user document:', userData);
              // You can perform additional actions here, such as storing the user data in a service.
            });
          }
        })
        .catch((err) => alert('Fel vid inloggning: ' + err.message));
    } else {
      this.authService
        .register(this.email, this.password)
        .then(async (res) => {
          if (res.user && res.user.uid) {
            // Create a document in the "users" collection with the UID as the doc ID.
            const userRef = doc(this.firestore, 'users', res.user.uid);
            await setDoc(userRef, {
              username: '',
              avatar: '',
              currentlyreading: '',
              savedbooks: [],
              // Add more fields as needed.
            });
            console.log(
              'Registration complete and user document created:',
              res.user.uid
            );
          }
        })
        .catch((err) => alert('Fel vid registrering: ' + err.message));
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
