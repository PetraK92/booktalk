import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Här skapar vi en Observable som kommer att hålla reda på användarens autentiseringstillstånd.
  user$: Observable<any>;

  constructor(private auth: Auth) {
    // authState ger oss ett observable som vi kan använda för att lyssna på inloggningsstatus och användarens data.
    this.user$ = authState(this.auth); // Återger ett observable som emitterar användardata
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
