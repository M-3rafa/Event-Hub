import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiBase = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // ----- Tickets -----
  createTicketSession(
    ticketTypeId: number,
    quantity: number,
    successUrl: string,
    cancelUrl: string
  ): Observable<any> {
    return this.http.post(`${this.apiBase}/Payments/create-ticket-session`, {
      ticketTypeId,
      quantity,
      successUrl,
      cancelUrl,
    });
  }

  confirmTicketPayment(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiBase}/Payments/confirm-ticket-payment`, {
      sessionId,
    });
  }

  // ----- Reservations -----
  payReservation(reservationId: number): Observable<any> {
    return this.http.post(
      `${this.apiBase}/User/pay-reservation/${reservationId}`,
      {}
    );
  }

  reservePlace(placeId: number, date: string): Observable<any> {
    return this.http.post(`${this.apiBase}/User/reserve-place`, {
      placeId,
      date: date + 'T00:00:00',
    });
  }

  confirmReservationPayment(sessionId: string): Observable<any> {
    return this.http.post(
      `${this.apiBase}/Payments/confirm-reservation-payment`,
      { sessionId }
    );
  }
}
