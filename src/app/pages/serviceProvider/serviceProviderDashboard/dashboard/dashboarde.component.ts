import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboarde',
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  templateUrl: './dashboarde.component.html',
  styleUrl: './dashboarde.component.scss',
})
export class DashboardeComponent {}
