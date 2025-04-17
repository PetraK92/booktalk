import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'books/:id', component: BookDetailsComponent },
    ],
  },
  { path: 'admin', component: AdminComponent },
];
