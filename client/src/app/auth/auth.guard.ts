import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../app.auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        if (user) {
          return true; // Om användaren är inloggad tillåts åtkomst
        } else {
          this.router.navigate(['/login']); // Om användaren inte är inloggad, omdirigeras till inloggningssidan
          return false;
        }
      })
    );
  }
}
