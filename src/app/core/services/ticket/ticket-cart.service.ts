import { Injectable } from '@angular/core';
import { CartTicket } from '../../../models/ticket/cart-ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketCartService {
  private CART_KEY = 'event_cart';

  getCart(): CartTicket[] {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  addTicket(ticket: CartTicket) {
    const cart = this.getCart();
    const index = cart.findIndex(
      (t) =>
        t.eventId === ticket.eventId && t.ticketTypeId === ticket.ticketTypeId
    );
    if (index > -1) {
      cart[index].quantity += ticket.quantity;
    } else {
      cart.push(ticket);
    }
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  removeTicket(index: number) {
    const cart = this.getCart();
    cart.splice(index, 1);
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  clearCart() {
    localStorage.removeItem(this.CART_KEY);
  }
}
