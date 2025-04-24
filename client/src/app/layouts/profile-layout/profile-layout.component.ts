import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.css'],
})
export class ProfileLayoutComponent {}
