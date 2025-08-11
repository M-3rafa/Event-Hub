import { Routes } from '@angular/router';
import { RegisterComponent } from './layouts/auth-layout/register/register.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { GuestComponent } from './layouts/guest/guest.component';
import { loggedGuard } from './core/guards/logged/logged.guard';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./layouts/auth-layout/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'login',
      },
      { path: 'register', component: RegisterComponent, title: 'register' },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    canActivate: [loggedGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./layouts/home/home.component').then((m) => m.HomeComponent),
        title: 'home',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './pages/serviceProvider/serviceProviderDashboard/dashboard/dashboarde.component'
          ).then((m) => m.DashboardeComponent),
        title: 'dashboards',
        children: [
          {
            path: 'createEvent',
            loadComponent: () =>
              import(
                './pages/serviceProvider/add-event/add-event.component'
              ).then((m) => m.AddEventComponent),
            title: 'Creat Event',
          },
          {
            path: 'myevents',
            loadComponent: () =>
              import(
                './pages/serviceProvider/my-events/my-events.component'
              ).then((m) => m.MyEventsComponent),
            title: 'My Event',
          },
          {
            path: 'eventDetails/:id',
            loadComponent: () =>
              import(
                './pages/serviceProvider/event-details/event-details.component'
              ).then((m) => m.EventDetailsComponent),
            title: 'EventDetails',
          },
          {
            path: 'AddPlace',
            loadComponent: () =>
              import(
                './pages/serviceProvider/place/add-place/add-place.component'
              ).then((m) => m.AddPlaceComponent),
            title: 'Creat Place',
          },
          {
            path: 'myPlaces',
            loadComponent: () =>
              import(
                './pages/serviceProvider/place/my-places/my-places.component'
              ).then((m) => m.MyPlacesComponent),
            title: 'My Place',
          },
          {
            path: 'editPlace/:id',
            loadComponent: () =>
              import(
                './pages/serviceProvider/place/edit-place/edit-place.component'
              ).then((m) => m.EditPlaceComponent),
            title: 'Edit Palce',
          },
          {
            path: 'PlaceAvailability/:id',
            loadComponent: () =>
              import(
                './pages/serviceProvider/place/place-availability/place-availability.component'
              ).then((m) => m.PlaceAvailabilityComponent),
            title: 'Place Availability',
          },
        ],
      },
      {
        path: 'admin/dashboard',
        loadComponent: () =>
          import(
            './pages/admin/admin-dashboard/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
        title: 'dashboard',
        children: [
          {
            path: 'Events',
            loadComponent: () =>
              import('./pages/admin/admin-events/admin-events.component').then(
                (m) => m.AdminEventsComponent
              ),
            title: 'Events',
          },
          {
            path: 'Places',
            loadComponent: () =>
              import('./pages/admin/admin-places/admin-places.component').then(
                (m) => m.AdminPlacesComponent
              ),
            title: 'Places',
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/admin-users/admin-users.component').then(
                (m) => m.AdminUsersComponent
              ),
            title: 'users',
          },
          {
            path: 'Requests',
            loadComponent: () =>
              import('./pages/admin/requests/requests.component').then(
                (m) => m.RequestsComponent
              ),
            title: 'Requests',
          },
        ],
      },
      {
        path: 'User',
        children: [
          {
            path: 'EventList',
            loadComponent: () =>
              import(
                './pages/user/userEvent/event-list/event-list.component'
              ).then((m) => m.EventListComponent),
            title: 'Event List',
          },
          {
            path: 'EventsDetails/:id',
            loadComponent: () =>
              import(
                './pages/user/userEvent/even-details/even-details.component'
              ).then((m) => m.EvenDetailsComponent),
            title: 'Event Details',
          },
          {
            path: 'MyTickets',
            loadComponent: () =>
              import(
                './pages/user/userDashboard/my-tickets/my-tickets.component'
              ).then((m) => m.MyTicketsComponent),
            title: 'My Tickets',
          },
          {
            path: 'Checkout',
            loadComponent: () =>
              import(
                './pages/user/userDashboard/checkout/checkout.component'
              ).then((m) => m.CheckoutComponent),
            title: 'Checkout',
          },
          {
            path: 'becomeprovider',
            loadComponent: () =>
              import(
                './pages/serviceProvider/become-provider/become-provider.component'
              ).then((m) => m.BecomeProviderComponent),
            title: 'become-provider',
          },

          {
            path: 'Places',
            loadComponent: () =>
              import(
                './pages/user/userPlace/place-list/place-list.component'
              ).then((m) => m.PlaceListComponent),
            title: 'Place',
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
