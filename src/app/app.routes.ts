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
];
