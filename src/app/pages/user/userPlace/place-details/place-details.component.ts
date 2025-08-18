import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CartReservationService } from '../../../../core/services/ticket/Reservation/cart-reservation.service';
import { UrlServiceService } from '../../../../core/services/url/url-service.service';
import '@angular/localize/init';

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    CommonModule,
    NgbDatepickerModule,
  ],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss',
})
export class PlaceDetailsComponent implements OnInit, AfterViewInit {
  place: any;
  loading = true;
  errorMsg = '';
  selectedDate: NgbDateStruct | null = null;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  disabledDates: Set<string> = new Set();
  reserveMsg: string = '';

  private apiBase = 'https://localhost:7015';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private calendar: NgbCalendar,
    private reservationCartService: CartReservationService,
    private imgURL: UrlServiceService
  ) {
    const today = this.calendar.getToday();
    this.minDate = today;
    this.maxDate = { year: today.year + 1, month: 12, day: 31 };
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'Invalid Place ID';
      this.loading = false;
      return;
    }

    this.http.get<any>(`${this.apiBase}/api/User/place/${id}`).subscribe({
      next: (res) => {
        this.place = res;
        // Build disabled dates from returned Availabilities (provider-only API is not needed)
        this.disabledDates.clear();
        (this.place.availabilities || []).forEach((a: any) => {
          if (a.isBlocked) {
            const d = new Date(a.date);
            const s = d.toISOString().slice(0, 10);
            this.disabledDates.add(s);
          }
        });
        this.loading = false;
        setTimeout(() => this.initMap(), 300);
      },
      error: () => {
        this.errorMsg = 'Failed to load place details';
        this.loading = false;
      },
    });
  }

  ngAfterViewInit() {
    /* map is created in ngOnInit after data loads */
  }

  initMap() {
    if (!this.place?.latitude || !this.place?.longitude) return;
    const anyWin = window as any;
    if (anyWin.leafletMap) anyWin.leafletMap.remove();

    anyWin.leafletMap = L.map('map').setView(
      [this.place.latitude, this.place.longitude],
      15
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(anyWin.leafletMap);
    L.marker([this.place.latitude, this.place.longitude])
      .addTo(anyWin.leafletMap)
      .bindPopup(this.place.location)
      .openPopup();
  }

  onDateSelect(event: any) {
    this.selectedDate = event;
  }

  isDisabledDate = (date: NgbDateStruct) => {
    const s = `${date.year}-${('0' + date.month).slice(-2)}-${(
      '0' + date.day
    ).slice(-2)}`;
    return this.disabledDates.has(s);
  };

  reserve() {
    if (!this.selectedDate || !this.place) return;
    const d = this.selectedDate;
    const dateString = `${d.year}-${('0' + d.month).slice(-2)}-${(
      '0' + d.day
    ).slice(-2)}`;

    this.reservationCartService.addReservation({
      placeId: this.place.id,
      placeName: this.place.location,
      date: dateString,
      price: this.place.price || 0,
    });
    this.reserveMsg = 'Reservation added to cart!';
  }

  imgUrl(url: any): string {
    return this.imgURL.getFullImageUrl(url);
  }
}
