import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.css'],
})
export class ProfileLayoutComponent {}
