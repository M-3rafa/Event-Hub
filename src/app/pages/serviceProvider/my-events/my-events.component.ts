import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { UrlServiceService } from '../../../core/services/url/url-service.service';

@Component({
  selector: 'app-my-events',
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss',
})
export class MyEventsComponent implements OnInit {
  events: any[] = [];
  loading = true;

  constructor(
    private eventService: EventService,
    public urlService: UrlServiceService,
    public router: Router
  ) {}

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

  getFullImageUrl(imgPath: string) {
    if (!imgPath) return '';
    return this.urlService.getFullImageUrl(imgPath);
  }

  goToEventDetails(eventId: number) {
    this.router.navigate(['/dashboard/eventDetails', eventId]);
    console.log('ve' + eventId);
  }
}
