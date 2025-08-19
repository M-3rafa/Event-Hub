import { Component, OnInit } from '@angular/core';
import {
  EventStats,
  ProviderDashboardService,
} from '../../../core/services/provider-dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-dashboard',
  imports: [CommonModule],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.scss',
})
export class ProviderDashboardComponent implements OnInit {
  events: EventStats[] = [];
  loading = true;
  error = '';

  constructor(private dashboardService: ProviderDashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getMyEventsStats().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading data';
        console.error(err);
        this.loading = false;
      },
    });
  }
}
