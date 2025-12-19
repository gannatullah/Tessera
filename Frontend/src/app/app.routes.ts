import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./Feature/Components/customer/home/home.component').then(
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
      import('./Feature/Components/customer/mybookings/mybookings.component').then(
        (c) => c.MybookingsComponent
      ),
  },
  {path: 'myevents',
    loadComponent: () =>
      import('./Feature/Components/organizer/myevents/myevents.component').then(
        (c) => c.MyeventsComponent
      ),
  },
  {
    path: 'create-event',
    loadComponent: () =>
      import('./Feature/Components/organizer/createevent/createevent.component').then(
        (c) => c.CreateeventComponent
      ),
  },
  {
    path: 'edit-event/:id',
    loadComponent: () =>
      import('./Feature/Components/organizer/editevent/editevent.component').then(
        (c) => c.EditeventComponent
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
    path: 'organizer-profile/:id',
    loadComponent: () =>
      import('./Feature/Components/organizer/organizer-profile/organizer-profile.component').then(
        (c) => c.OrganizerProfileComponent
      ),
  },
  {
    path: 'account-type',
    loadComponent: () =>
      import('./Core/Components/account-type/account-type.component').then(
        (c) => c.AccountTypeComponent
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
  {
    path: 'event-details/:id',
    loadComponent: () =>
      import('./Feature/Components/customer/event-details/event-details.component').then(
        (c) => c.EventDetailsComponent
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./Feature/Components/customer/wishlist/wishlist.component').then(
        (c) => c.WishlistComponent
      ),
  },
  {
    path: 'payment/:eventId',
    loadComponent: () =>
      import('./Feature/Components/customer/payment/payment.component').then(
        (c) => c.PaymentComponent
      ),
  }
];