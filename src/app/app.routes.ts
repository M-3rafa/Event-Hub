import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { RegisterComponent } from '../layouts/auth-layout/register/register.component';
import { LoginComponent } from '../layouts/auth-layout/login/login.component';
import { HomeComponent } from '../layouts/home/home.component';
import { create } from 'domain';
import { AddEventComponent } from '../pages/serviceProvider/add-event/add-event.component';
import { MyEventsComponent } from '../pages/serviceProvider/my-events/my-events.component';
import { AdminEventsComponent } from '../pages/admin/admin-events/admin-events.component';
import { AdminUsersComponent } from '../pages/admin/admin-users/admin-users.component';
import { AdminDashboardComponent } from '../pages/admin/admin-dashboard/admin-dashboard/admin-dashboard.component';
import path from 'path';
import { DashboardeComponent } from '../pages/serviceProvider/serviceProviderDashboard/dashboard/dashboarde.component';
import { EventDetailsComponent } from '../pages/serviceProvider/event-details/event-details.component';
import { BecomeProviderComponent } from '../pages/serviceProvider/become-provider/become-provider.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeComponent,
    title: 'home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../layouts/auth-layout/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'becomeprovider',
    component: BecomeProviderComponent,
    title: 'become-provider',
  },

  // Service Provider

  {
    path: 'dashboard',
    component: DashboardeComponent,
    title: 'dashboards',
    children: [
      {
        path: 'createEvent',
        component: AddEventComponent,
        title: 'Creat Event',
      },
      {
        path: 'myevents',
        component: MyEventsComponent,
        title: 'My Event',
      },
      {
        path: 'EventDetails',
        component: EventDetailsComponent,
        title: 'EventDetails',
      },
    ],
  },

  //Admin
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    title: 'dashboard',
    children: [
      { path: 'Events', component: AdminEventsComponent, title: 'Events' },
      { path: 'users', component: AdminUsersComponent, title: 'users' },
    ],
  },
  //###################################
  { path: 'register', component: RegisterComponent, title: 'register' },
  { path: '**', redirectTo: 'home' },
];
