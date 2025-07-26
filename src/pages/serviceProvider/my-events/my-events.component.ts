import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events',
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss',
})
export class MyEventsComponent implements OnInit {
  events: any[] = [];
  loading = true;

  constructor(private eventService: EventService, public router: Router) {}

  ngOnInit(): void {
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    this.eventService.getMyEvents().subscribe({
      next: (res: any[]) => {
        this.events = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  getFullImageUrl(img: string) {
    if (!img) return '';
    return img.startsWith('http') ? img : `https://localhost:7015${img}`;
  }

  goToEventDetails(eventId: number) {
    this.router.navigate(['/event-details', eventId]);
  }
}
