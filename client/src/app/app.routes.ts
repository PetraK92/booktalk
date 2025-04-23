import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileLayoutComponent } from './layouts/profile-layout/profile-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';

// Standalone sidor för profilsektionen
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
      { path: '', component: UserProfileComponent }, // Översikt
      {
        path: 'inställningar',
        loadComponent: () =>
          import('./pages/profile-settings/profile-settings.component').then(
            (m) => m.ProfileSettingsComponent
          ),
      },
      {
        path: 'bokhylla',
        loadComponent: () =>
          import('./pages/profile-bookshelf/profile-bookshelf.component').then(
            (m) => m.ProfileBookshelfComponent
          ),
      },
    ],
  },
];
