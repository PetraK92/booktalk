import { Component } from '@angular/core';
import { AuthService } from '../app.auth.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.isLoginMode) {
      this.authService
        .login(this.email, this.password)
        .then((res) => console.log('Inloggad:', res.user.email))
        .catch((err) => alert('Fel vid inloggning: ' + err.message));
    } else {
      this.authService
        .register(this.email, this.password)
        .then((res) => console.log('Registrerad:', res.user.email))
        .catch((err) => alert('Fel vid registrering: ' + err.message));
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
