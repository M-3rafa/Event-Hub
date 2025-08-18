import { Injectable } from '@angular/core';
import { CartReservation } from '../../../../models/place';

@Injectable({
  providedIn: 'root',
})
export class CartReservationService {
  private key = 'reservation_cart';

  getCart(): CartReservation[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  addReservation(reservation: CartReservation) {
    const cart = this.getCart();
    // prevent duplicate same-date reservations for same place
    const exists = cart.some(
      (r) => r.placeId === reservation.placeId && r.date === reservation.date
    );
    if (!exists) {
      cart.push(reservation);
      localStorage.setItem(this.key, JSON.stringify(cart));
    }
  }

  updateReservation(index: number, updated: CartReservation) {
    const cart = this.getCart();
    cart[index] = updated;
    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  removeReservation(index: number) {
    const cart = this.getCart();
    cart.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  clearCart() {
    localStorage.removeItem(this.key);
  }
}
