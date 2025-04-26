import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileLayoutComponent } from './layouts/profile-layout/profile-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'books/:id', component: BookDetailsComponent },
    ],
  },
  {
    path: 'profil',
    component: ProfileLayoutComponent,
    children: [
      { path: '', component: UserProfileComponent },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/profile-settings/profile-settings.component').then(
            (m) => m.ProfileSettingsComponent
          ),
      },
      {
        path: 'bookshelf',
        loadComponent: () =>
          import('./pages/profile-bookshelf/profile-bookshelf.component').then(
            (m) => m.ProfileBookshelfComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'read-books',
            pathMatch: 'full',
          },
          {
            path: 'read-books',
            loadComponent: () =>
              import('./pages/read-books-page/read-books-page.component').then(
                (m) => m.ReadBooksPageComponent
              ),
            children: [{ path: 'books/:id', component: BookDetailsComponent }],
          },
          {
            path: 'tbr',
            loadComponent: () =>
              import('./pages/tbr-page/tbr-page.component').then(
                (m) => m.TbrPageComponent
              ),
            children: [{ path: 'books/:id', component: BookDetailsComponent }],
          },
        ],
      },
    ],
  },
];
