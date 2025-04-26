import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToBeReadComponent } from '../../to-be-read/to-be-read.component';

@Component({
  selector: 'app-tbr-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ToBeReadComponent],
  template: `<app-to-be-read></app-to-be-read>`,
  styleUrls: ['./tbr-page.component.css'],
})
export class TbrPageComponent {}
