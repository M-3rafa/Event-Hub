import { Component, OnInit } from '@angular/core';
import { CartTicket } from '../../../../models/ticket/cart-ticket';
import { TicketCartService } from '../../../../core/services/ticket/ticket-cart.service';
import { CommonModule } from '@angular/common';
import { CartReservationService } from '../../../../core/services/ticket/Reservation/cart-reservation.service';
import { PaymentService } from '../../../../core/services/Payment/payment.service';
import { CartReservation } from '../../../../models/place';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

declare global {
  interface Window {
    Stripe: any;
  }
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  ticketCart: CartTicket[] = [];
  reservationCart: CartReservation[] = [];
  payingTicketIndex: number | null = null;
  payingReservationIndex: number | null = null;
  payMessage = '';

  private apiBase = 'https://localhost:7015';
  private checkoutUrl = window.location.origin + '/#/User/Checkout';

  constructor(
    private ticketCartService: TicketCartService,
    private reservationCartService: CartReservationService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.refreshCarts();
    this.handleStripeReturn();
  }

  refreshCarts() {
    this.ticketCart = this.ticketCartService.getCart();
    this.reservationCart = this.reservationCartService.getCart();
  }

  // ---------- handle Stripe return ----------
  private handleStripeReturn() {
    this.route.queryParams.subscribe((params) => {
      const kind = params['kind'];
      const success = params['success'];
      const canceled = params['canceled'];
      const sessionId = params['session_id'];

      if (canceled) {
        this.payMessage = ' Payment was cancelled.';
        return;
      }

      if (success === '1' && sessionId) {
        if (kind === 'ticket') {
          this.confirmTicket(sessionId);
        } else if (kind === 'reservation') {
          this.confirmReservation(sessionId);
        }
      } else {
        this.payMessage = ' Payment failed or missing session ID.';
      }
    });
  }

  // ---------- Tickets ----------
  async payTicket(index: number) {
    this.payingTicketIndex = index;
    this.payMessage = '';
    try {
      const t = this.ticketCart[index];
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiBase}/api/Payments/create-ticket-session`, {
          ticketTypeId: t.ticketTypeId,
          quantity: t.quantity,
          successUrl: this.checkoutUrl,
          cancelUrl: this.checkoutUrl,
        })
      );
      const stripe = window.Stripe(res.publicKey);
      const result = await stripe.redirectToCheckout({
        sessionId: res.sessionId,
      });
      if (result.error)
        this.payMessage = result.error.message || 'Stripe redirection failed.';
    } catch (err: any) {
      this.payMessage =
        err?.error?.message ||
        'Payment endpoint not found (404). Ensure PaymentsController is added & API restarted.';
    } finally {
      this.payingTicketIndex = null;
    }
  }

  private async confirmTicket(sessionId: string) {
    this.payMessage = 'Finalizing ticket payment...';
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiBase}/api/Payments/confirm-ticket-payment`, {
          sessionId,
        })
      );
      this.payMessage = res.message || 'Tickets confirmed!';
      this.ticketCartService.clearCart();
      this.refreshCarts();
    } catch (err: any) {
      this.payMessage =
        err?.error?.message || 'Failed to confirm ticket payment.';
    }
  }

  // ---------- Reservations ----------
  async payReservation(index: number) {
    this.payingReservationIndex = index;
    this.payMessage = '';

    try {
      const reservationId = await this.ensureReservationId(index);

      const res: any = await this.http
        .post(`${this.apiBase}/api/User/pay-reservation/${reservationId}`, {})
        .toPromise();

      this.payMessage = res?.message || 'Reservation confirmed!';
      this.reservationCartService.clearCart();
      this.refreshCarts();
    } catch (err: any) {
      this.payMessage = err?.error?.message || 'Failed to pay for reservation.';
    } finally {
      this.payingReservationIndex = null;
    }
  }

  private async ensureReservationId(index: number): Promise<number> {
    const r: any = this.reservationCart[index];
    if (r.reservationId) return r.reservationId;

    const payload = { placeId: r.placeId, date: r.date + 'T00:00:00' };
    const res: any = await firstValueFrom(
      this.http.post(`${this.apiBase}/api/User/reserve-place`, payload)
    );
    r.reservationId = res.reservationId;
    this.reservationCartService.updateReservation(index, r);
    return r.reservationId;
  }

  private async confirmReservation(sessionId: string) {
    this.payMessage = 'Finalizing reservation payment...';
    try {
      const res: any = await firstValueFrom(
        this.http.post(
          `${this.apiBase}/api/Payments/confirm-reservation-payment`,
          { sessionId }
        )
      );
      this.payMessage = res.message || 'Reservation confirmed!';
      this.reservationCartService.clearCart();
      this.refreshCarts();
    } catch (err: any) {
      this.payMessage =
        err?.error?.message || 'Failed to confirm reservation payment.';
    }
  }

  clearCart() {
    this.ticketCartService.clearCart();
    this.reservationCartService.clearCart();
    this.refreshCarts();
  }
}
