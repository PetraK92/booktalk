import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    // Endast en gång – lyssna på authState
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Registrera ny användare
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Logga in
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logga ut
  logout() {
    return signOut(this.auth);
  }

  // Hämtar aktuell användare från cache
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
