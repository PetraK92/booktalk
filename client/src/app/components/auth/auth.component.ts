import { Component, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/app.auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { AvatarPickerComponent } from '../avatar-picker/avatar-picker.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, AvatarPickerComponent],
})
export class AuthComponent {
  email = '';
  password = '';
  username = '';
  avatar: string = '';
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

  onAvatarSelected(avatarUrl: string) {
    this.avatar = avatarUrl;
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
            username: this.username,
            avatar: this.avatar,
            email: this.email,
            currentlyReading: [],
            savedBooks: [],
          });
        }
        this.email = '';
        this.password = '';
        this.username = '';
        this.avatar = '';
        this.visibleDropdown = null;
      })
      .catch((err) => {
        this.errorMessage = `Fel vid ${
          isLogin ? 'inloggning' : 'registrering'
        }: ${err.message}`;
        console.error(this.errorMessage);
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
