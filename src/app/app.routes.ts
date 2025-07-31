import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { create } from 'domain';
import path from 'path';
import { HomeComponent } from './layouts/home/home.component';
import { RegisterComponent } from './layouts/auth-layout/register/register.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './pages/admin/admin-events/admin-events.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { BecomeProviderComponent } from './pages/serviceProvider/become-provider/become-provider.component';
import { MyEventsComponent } from './pages/serviceProvider/my-events/my-events.component';
import { DashboardeComponent } from './pages/serviceProvider/serviceProviderDashboard/dashboard/dashboarde.component';
import { RequestsComponent } from './pages/admin/requests/requests.component';
import { AdminPlacesComponent } from './pages/admin/admin-places/admin-places.component';
import { EvenDetailsComponent } from './pages/user/userEvent/even-details/even-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('../app/layouts/home/home.component').then((m) => m.HomeComponent),
    title: 'home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/layouts/auth-layout/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'login',
  },

  // Service Provider

  {
    path: 'dashboard',
    component: DashboardeComponent,
    title: 'dashboards',
    children: [
      {
        path: 'createEvent',
        loadComponent: () =>
          import(
            '../app/pages/serviceProvider/add-event/add-event.component'
          ).then((m) => m.AddEventComponent),
        title: 'Creat Event',
      },
      {
        path: 'myevents',
        component: MyEventsComponent,
        title: 'My Event',
      },
      {
        path: 'eventDetails/:id',
        loadComponent: () =>
          import(
            '../app/pages/serviceProvider/event-details/event-details.component'
          ).then((m) => m.EventDetailsComponent),

        title: 'EventDetails',
      },
      {
        path: 'AddPlace',
        loadComponent: () =>
          import(
            '../app/pages/serviceProvider/place/add-place/add-place.component'
          ).then((m) => m.AddPlaceComponent),

        title: 'Creat Place',
      },
      {
        path: 'myPlaces',
        loadComponent: () =>
          import(
            '../app/pages/serviceProvider/place/my-places/my-places.component'
          ).then((m) => m.MyPlacesComponent),

        title: 'My Place',
      },
      {
        path: 'editPlace/:id',
        loadComponent: () =>
          import(
            '../app/pages/serviceProvider/place/edit-place/edit-place.component'
          ).then((m) => m.EditPlaceComponent),

        title: 'Edit Palce',
      },
      {
        path: 'PlaceAvailability/:id',
        loadComponent: () =>
          import(
            '../app/pages/serviceProvider/place/place-availability/place-availability.component'
          ).then((m) => m.PlaceAvailabilityComponent),

        title: 'Place Availability',
      },
    ],
  },
  // ##################################################
  //Admin
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    title: 'dashboard',
    children: [
      { path: 'Events', component: AdminEventsComponent, title: 'Events' },

      {
        path: 'Places',
        component: AdminPlacesComponent,
        title: 'Places',
      },
      { path: 'users', component: AdminUsersComponent, title: 'users' },
      {
        path: 'Requests',
        component: RequestsComponent,
        title: 'users',
      },
    ],
  },

  // ################################################3
  //User
  // {
  //     path: 'users',
  //     component: AdminDashboardComponent
  //     ,        title: 'users',
  // }

  {
    path: 'User',
    children: [
      {
        path: 'EventList',
        loadComponent: () =>
          import(
            '../app/pages/user/userEvent/event-list/event-list.component'
          ).then((m) => m.EventListComponent),
        title: 'Event List',
      },
      {
        path: 'EventsDetails/:id',
        component: EvenDetailsComponent,
        title: 'Event Details',
      },
      {
        path: 'MyTickets',
        loadComponent: () =>
          import(
            '../app/pages/user/userDashboard/my-tickets/my-tickets.component'
          ).then((m) => m.MyTicketsComponent),
        title: 'My Tickets',
      },
      {
        path: 'Checkout',
        loadComponent: () =>
          import(
            '../app/pages/user/userDashboard/checkout/checkout.component'
          ).then((m) => m.CheckoutComponent),
        title: 'Checkout',
      },

      {
        path: 'becomeprovider',
        component: BecomeProviderComponent,
        title: 'become-provider',
      },
    ],
  },

  //###################################
  { path: 'register', component: RegisterComponent, title: 'register' },
  { path: '**', redirectTo: 'home' },
];
