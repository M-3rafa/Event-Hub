import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { AdminEventsComponent } from '../../admin-events/admin-events.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterOutlet, DashboardSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {}
