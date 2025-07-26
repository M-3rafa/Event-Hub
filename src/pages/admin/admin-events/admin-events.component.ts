import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletMapService } from '../../../services/leaflet-map.service';
import { Event } from '../../../models/admin-model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
})
export class AdminEventsComponent implements OnInit, AfterViewChecked {
  events: Event[] = [];
  expandedEventId: number | null = null;
  rejectingEventId: number | null = null;
  rejectionNote: string = '';
  errorMsg: string = '';

  constructor(
    private adminService: AdminService,
    private mapService: LeafletMapService
  ) {}

  ngOnInit(): void {
    this.fetchPendingEvents();
  }

  ngAfterViewChecked() {
    if (this.expandedEventId !== null) {
      const event = this.events.find((ev) => ev.id === this.expandedEventId);
      if (event?.latitude && event?.longitude) {
        setTimeout(() => {
          this.mapService.renderMap(
            event.id,
            event.latitude!,
            event.longitude!
          );
        }, 150);
      }
    }
  }

  fetchPendingEvents() {
    this.adminService.getPendingEvents().subscribe({
      next: (res) => {
        this.events = res;
        this.mapService.resetAllMaps();
      },
      error: (err) => console.error(err),
    });
  }

  toggleExpand(id: number) {
    if (this.expandedEventId === id) {
      this.expandedEventId = null;
    } else {
      this.expandedEventId = id;
      this.errorMsg = '';
      this.rejectingEventId = null;
      this.mapService.clearRenderedMap(id); // Allow re-render
    }
  }

  approveEvent(id: number) {
    this.adminService.approveEvent(id).subscribe({
      next: () => this.fetchPendingEvents(),
      error: (err) => console.error(err),
    });
  }

  startRejectEvent(id: number) {
    this.rejectingEventId = id;
    this.rejectionNote = '';
    this.errorMsg = '';
  }

  cancelReject() {
    this.rejectingEventId = null;
    this.rejectionNote = '';
    this.errorMsg = '';
  }

  submitRejectEvent() {
    if (!this.rejectionNote.trim()) {
      this.errorMsg = 'Admin note is required.';
      return;
    }

    this.adminService
      .rejectEvent(this.rejectingEventId!, this.rejectionNote)
      .subscribe({
        next: () => {
          this.fetchPendingEvents();
          this.cancelReject();
        },
        error: (err) => {
          this.errorMsg = 'Failed to reject event.';
          console.error(err);
        },
      });
  }

  getFullFileUrl(url: string | null): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://localhost:7015${url}`;
  }
}
