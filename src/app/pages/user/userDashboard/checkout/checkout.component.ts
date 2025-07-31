import { Component, OnInit } from '@angular/core';
import { CartTicket } from '../../../../models/ticket/cart-ticket';
import { TicketCartService } from '../../../../core/services/ticket/ticket-cart.service';
import { BuyTicketService } from '../../../../core/services/ticket/buy-ticket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  cart: CartTicket[] = [];
  payingIndex: number | null = null;
  payMessage: string = '';

  constructor(
    private cartService: TicketCartService,
    private BuyTicketService: BuyTicketService
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  payTicket(index: number) {
    const ticket = this.cart[index];
    this.payingIndex = index;
    this.payMessage = '';

    this.BuyTicketService.buyTicket(
      ticket.ticketTypeId,
      ticket.quantity
    ).subscribe({
      next: (res: any) => {
        this.payMessage = res.message || 'Ticket booked successfully!';
        this.cartService.removeTicket(index);
        this.cart = this.cartService.getCart();
        this.payingIndex = null;
      },
      error: (err) => {
        this.payMessage = err.error?.message || 'Payment failed!';
        this.payingIndex = null;
      },
    });
  }

  clearCart() {
    this.cartService.clearCart();
    this.cart = [];
  }
}
