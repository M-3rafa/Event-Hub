import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../../../core/services/admin/place.service';
import { Place, PlaceAvailability } from '../../../models/place';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../core/environment/environment';

@Component({
  selector: 'app-admin-places',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-places.component.html',
  styleUrl: './admin-places.component.scss',
})
export class AdminPlacesComponent implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  placeTypes: string[] = [];
  selectedType: string = '';
  expandedPlaceId: number | null = null;

  calendars: { [placeId: number]: Date[][] } = {};
  availabilities: { [placeId: number]: PlaceAvailability[] } = {};

  rejectingPlaceId: number | null = null;
  rejectionReason: string = '';
  rejectionError: string = '';

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.fetchPlaces();
  }

  fetchPlaces(): void {
    console.log('hi' + environment.baseUrl);
    this.placeService.getPlaces().subscribe({
      next: (res) => {
        this.places = res.map((p) => ({
          ...p,
          imageUrl: this.placeService.getFullUrl(p.imageUrl),
          securityClearanceUrl: this.placeService.getFullUrl(
            p.securityClearanceUrl
          ),
          ownershipOrRentalContractUrl: this.placeService.getFullUrl(
            p.ownershipOrRentalContractUrl
          ),
          nationalIdFrontUrl: this.placeService.getFullUrl(
            p.nationalIdFrontUrl
          ),
          nationalIdBackUrl: this.placeService.getFullUrl(p.nationalIdBackUrl),
        }));
        this.placeTypes = Array.from(
          new Set(this.places.map((p) => p.placeTypeName))
        ).sort();
        this.filteredPlaces = this.places;
      },
      error: (err) => console.error(err),
    });
  }

  filterPlaces() {
    this.filteredPlaces = this.selectedType
      ? this.places.filter((p) => p.placeTypeName === this.selectedType)
      : this.places;
    this.expandedPlaceId = null;
  }

  approvePlace(id: number): void {
    this.placeService.approvePlace(id).subscribe({
      next: () => {
        this.places = this.places.map((p) =>
          p.id === id ? { ...p, isApproved: true } : p
        );
        this.filterPlaces();
      },
      error: (err) => console.error(err),
    });
  }

  openRejectModal(placeId: number) {
    this.rejectingPlaceId = placeId;
    this.rejectionReason = '';
    this.rejectionError = '';
  }

  closeRejectModal() {
    this.rejectingPlaceId = null;
    this.rejectionReason = '';
    this.rejectionError = '';
  }

  confirmRejectPlace() {
    if (!this.rejectionReason.trim()) {
      this.rejectionError = 'Rejection reason is required.';
      return;
    }
    this.placeService
      .rejectPlace(this.rejectingPlaceId!, this.rejectionReason)
      .subscribe({
        next: () => {
          this.places = this.places.map((p) =>
            p.id === this.rejectingPlaceId
              ? { ...p, isApproved: false, adminNote: this.rejectionReason }
              : p
          );
          this.filterPlaces();
          this.closeRejectModal();
        },
        error: (err) => {
          this.rejectionError = 'Failed to reject place. Please try again.';
          console.error(err);
        },
      });
  }

  toggleExpand(id: number) {
    this.expandedPlaceId = this.expandedPlaceId === id ? null : id;
    if (this.expandedPlaceId && !this.availabilities[id]) {
      this.fetchAvailabilities(id);
    }
    if (this.expandedPlaceId && !this.calendars[id]) {
      this.calendars[id] = this.generateCalendar(new Date());
    }
  }

  fetchAvailabilities(placeId: number) {
    this.placeService.getAvailabilities(placeId).subscribe({
      next: (res) => (this.availabilities[placeId] = res),
      error: (err) => {
        this.availabilities[placeId] = [];
        console.error(err);
      },
    });
  }

  generateCalendar(date: Date): Date[][] {
    const year = date.getFullYear(),
      month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendar: Date[][] = [];
    let week: Date[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) week.push(null as any);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    while (week.length < 7) week.push(null as any);
    calendar.push(week);
    return calendar;
  }

  isBlocked(placeId: number, d: Date): boolean {
    return (
      this.availabilities[placeId]?.some(
        (a) =>
          a.isBlocked &&
          d &&
          new Date(a.date).toDateString() === d.toDateString()
      ) ?? false
    );
  }
}
