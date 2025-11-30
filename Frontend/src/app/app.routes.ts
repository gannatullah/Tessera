import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./Feature/Components/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./Shared/Components/events/events.component').then(
        (c) => c.EventsComponent
      ),
  },
  {
    path: 'mybookings',
    loadComponent: () =>
      import('./Feature/Components/mybookings/mybookings.component').then(
        (c) => c.MybookingsComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./Feature/Components/profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./Core/Components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Core/Components/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
];
