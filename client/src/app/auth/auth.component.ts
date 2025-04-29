import { Component, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../app.auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AuthComponent {
  email = '';
  password = '';
  visibleDropdown: 'signin' | 'signup' | null = null;
  user: any = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private elementRef: ElementRef
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.visibleDropdown = null;
    });
  }

  toggleDropdown(mode: 'signin' | 'signup') {
    this.visibleDropdown = this.visibleDropdown === mode ? null : mode;
  }

  onSubmit(isLogin: boolean) {
    const action = isLogin
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password);

    action
      .then(async (res) => {
        if (res.user?.uid && !isLogin) {
          const userRef = doc(this.firestore, 'users', res.user.uid);
          await setDoc(userRef, {
            username: '', // Lägg till användarnamn om du vill att användare ska kunna sätta sitt eget användarnamn
            avatar: '', // Lägg till användaravatar här om du har ett fält för det
            email: this.email, // Lägg till e-postadress här för att lagra det i användardokumentet
            currentlyReading: [], // En tom lista för användarens "currently reading" böcker
            savedBooks: [], // En lista för användarens sparade böcker
          });
        }
        this.email = '';
        this.password = '';
        this.visibleDropdown = null;
      })
      .catch((err) => {
        this.errorMessage = `Fel vid ${
          isLogin ? 'inloggning' : 'registrering'
        }: ${err.message}`;
        console.error(this.errorMessage); // Logga felet för felsökning
      });
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      this.visibleDropdown &&
      !this.elementRef.nativeElement.contains(targetElement)
    ) {
      this.visibleDropdown = null;
    }
  }
}
