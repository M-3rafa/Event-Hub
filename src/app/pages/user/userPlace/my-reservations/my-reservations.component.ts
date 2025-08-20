import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Reservation {
  id: number;
  date: string;
  status: string;
  placeName: string;
  placeId: number;
}

@Component({
  selector: 'app-my-reservations',
  imports: [CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss',
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading: boolean = false;
  errorMsg: string = '';
  downloadingId: number | null = null; // 👈 هنا

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations() {
    this.loading = true;
    this.errorMsg = '';
    this.http
      .get<Reservation[]>('https://localhost:7015/api/User/my-reservations')
      .subscribe({
        next: (data) => {
          this.reservations = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Failed to load reservations';
          this.loading = false;
        },
      });
  }
  downloadPdf(reservationId: number) {
    this.downloadingId = reservationId; // 👈 start loading
    this.http
      .get(`https://localhost:7015/api/User/reservation-pdf/${reservationId}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reservation_${reservationId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.downloadingId = null; // 👈 stop loading
        },
        error: () => {
          alert(
            'Error downloading PDF. You may not be authorized or the file does not exist.'
          );
          this.downloadingId = null; // 👈 stop loading on error
        },
      });
  }
}
