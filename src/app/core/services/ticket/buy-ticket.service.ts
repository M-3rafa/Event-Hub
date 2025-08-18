import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class BuyTicketService {
  constructor(private http: HttpClient) {}

  buyTicket(ticketTypeId: number, quantity: number): Observable<any> {
    return this.http.post(`${environment.baseUrl}/User/buy-ticket`, {
      ticketTypeId,
      quantity,
    });
  }
  createTicketSession(
    ticketTypeId: number,
    quantity: number,
    successUrl: string,
    cancelUrl: string
  ): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Payments/create-ticket-session`,
      {
        ticketTypeId,
        quantity,
        successUrl,
        cancelUrl,
      }
    );
  }

  confirmTicketPayment(sessionId: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Payments/confirm-ticket-payment`,
      { sessionId }
    );
  }

  // --- Reservations ---
  payReservation(reservationId: number): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/User/pay-reservation/${reservationId}`,
      {}
    );
  }

  confirmReservationPayment(sessionId: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Payments/confirm-reservation-payment`,
      { sessionId }
    );
  }

  // --- Reservation helper ---
  createReservation(placeId: number, date: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/User/reserve-place`, {
      placeId,
      date,
    });
  }
}
