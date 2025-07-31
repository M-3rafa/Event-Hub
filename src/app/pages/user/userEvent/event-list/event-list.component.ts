import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../core/environment/environment';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  loading = true;
  eventTypeFilter = '';
  search = '';
  eventTypes: string[] = ['Concert', 'Match', 'Workshop', 'Other'];
  baseUrl = environment.baseUrl.replace(/\/api\/?$/, '');

  constructor(private eventsService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventsService.getEvents(this.eventTypeFilter, this.search).subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Error loading events!');
      },
    });
  }

  onFilterChange() {
    this.loadEvents();
  }

  goToEventDetails(eventId: number) {
    this.router.navigate(['User/EventsDetails', eventId]);
  }
}
