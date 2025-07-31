import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import * as L from 'leaflet';
import { UrlServiceService } from '../../../core/services/url/url-service.service';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  eventId!: number;
  event: any = null;
  loading = true;
  editMode = false;
  editForm!: FormGroup;
  selectedFiles: { [key: string]: File } = {};
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private fb: FormBuilder,
    public router: Router,
    private UrlService: UrlServiceService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails();
  }

  ngAfterViewInit(): void {
    this.initMapIfNeeded();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }

  loadEventDetails() {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (res: any) => {
        this.event = res;
        this.initEditForm();
        this.loading = false;
        setTimeout(() => this.initMapIfNeeded(), 250);
      },
      error: () => {
        this.loading = false;
        alert('Error loading event!');
      },
    });
  }

  initEditForm() {
    this.editForm = this.fb.group({
      name: [this.event.name],
      eventType: [this.event.eventType],
      date: [this.event.date],
      description: [this.event.description],
      stadiumName: [this.event.stadiumName],
      teamA: [this.event.teamA],
      teamB: [this.event.teamB],
      performers: [this.event.performers],
      placeName: [this.event.placeName],
      ticketTypes: this.fb.array(
        (this.event.ticketTypes || []).map((t: any) =>
          this.fb.group({
            name: [t.name],
            price: [t.price],
            addQuantity: [0],
          })
        )
      ),
    });
  }

  get ticketTypesFormArray() {
    return (this.editForm.get('ticketTypes') as FormArray).controls;
  }

  onFileSelected(event: any, key: string) {
    if (event.target.files && event.target.files.length) {
      this.selectedFiles[key] = event.target.files[0];
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode) this.initEditForm();
  }

  addTicketType() {
    (this.editForm.get('ticketTypes') as FormArray).push(
      this.fb.group({
        name: [''],
        price: [0],
        addQuantity: [0],
      })
    );
  }

  saveEdit() {
    if (this.editForm.invalid) return;
    const formData = new FormData();

    Object.entries(this.editForm.value).forEach(([key, val]) => {
      if (key === 'ticketTypes') {
        (val as any[]).forEach((t, idx) => {
          formData.append(`TicketTypes[${idx}].Name`, t.name ?? '');
          formData.append(`TicketTypes[${idx}].Price`, t.price ?? 0);
          formData.append(`TicketTypes[${idx}].Quantity`, t.addQuantity ?? 0);
        });
      } else {
        formData.append(
          key,
          val === null || val === undefined
            ? ''
            : typeof val === 'object'
            ? JSON.stringify(val)
            : String(val)
        );
      }
    });

    [
      'image',
      'securityClearance',
      'publicLicenseFront',
      'publicLicenseBack',
      'civilProtectionApprovalFront',
      'civilProtectionApprovalBack',
      'eventInsurance',
    ].forEach((field) => {
      if (this.selectedFiles[field]) {
        let backendKey = '';
        switch (field) {
          case 'image':
            backendKey = 'Image';
            break;
          case 'securityClearance':
            backendKey = 'SecurityClearance';
            break;
          case 'publicLicenseFront':
            backendKey = 'PublicLicenseFront';
            break;
          case 'publicLicenseBack':
            backendKey = 'PublicLicenseBack';
            break;
          case 'civilProtectionApprovalFront':
            backendKey = 'CivilProtectionApprovalFront';
            break;
          case 'civilProtectionApprovalBack':
            backendKey = 'CivilProtectionApprovalBack';
            break;
          case 'eventInsurance':
            backendKey = 'EventInsurance';
            break;
        }
        formData.append(backendKey, this.selectedFiles[field]);
      }
    });

    this.eventService.editEvent(this.eventId, formData).subscribe({
      next: () => {
        alert('Event updated! Waiting for admin approval.');
        this.editMode = false;
        this.loadEventDetails();
      },
      error: () => alert('Error updating event!'),
    });
  }

  deleteEvent() {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.eventId).subscribe({
        next: () => {
          alert('Event deleted!');
          this.router.navigate(['/myevents']);
        },
        error: () => alert('Error deleting event!'),
      });
    }
  }

  getFullImageUrl(img: string | null) {
    if (!img) return '';
    return this.UrlService.getFullUrl(img);
  }

  initMapIfNeeded() {
    if (!this.event?.latitude || !this.event?.longitude) return;
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
    setTimeout(() => {
      this.map = L.map('eventDetailsMap', {
        center: [this.event.latitude, this.event.longitude],
        zoom: 13,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
      this.marker = L.marker([this.event.latitude, this.event.longitude]).addTo(
        this.map
      );
    }, 150);
  }
}
