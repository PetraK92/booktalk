import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable som håller koll på användarens autentiseringstillstånd.
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // authState ger oss ett observable som emitterar användardata när användaren loggar in eller ut.
    this.user$ = authState(this.auth);
  }

  // Registrera en ny användare
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Logga in en användare
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logga ut användaren
  logout() {
    return signOut(this.auth);
  }

  // Hämta den aktuella användaren (kan vara användbart om du vill kontrollera inloggad användare på andra ställen)
  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }
}
