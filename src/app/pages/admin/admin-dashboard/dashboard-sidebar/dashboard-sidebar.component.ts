import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  isCollapsed = false;
  router: any;
  constructor() {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
