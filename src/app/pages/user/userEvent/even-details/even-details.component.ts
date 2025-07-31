import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketCartService } from '../../../../core/services/ticket/ticket-cart.service';
import { UserService } from '../../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../core/environment/environment';

@Component({
  selector: 'app-even-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './even-details.component.html',
  styleUrl: './even-details.component.scss',
})
export class EvenDetailsComponent implements OnInit {
  eventId!: number;
  event: any = null;
  loading = true;
  errorMsg = '';
  actionMsg = '';
  baseUrl = environment.baseUrl.replace(/\/api\/?$/, '');
  selectedTicketTypeId: number | null = null;
  ticketQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private ticketCart: TicketCartService,
    private eventService: UserService
  ) {}

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchEvent();
  }

  fetchEvent() {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (res) => {
        this.event = res;
        if (this.event.ticketTypes && this.event.ticketTypes.length > 0) {
          this.selectedTicketTypeId = this.event.ticketTypes[0].id;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Event not found or no longer available.';
        this.loading = false;
      },
    });
  }

  get selectedTicketQuantity(): number {
    if (!this.event?.ticketTypes || !this.selectedTicketTypeId) return 1;
    const t = this.event.ticketTypes.find(
      (t: any) => t.id == this.selectedTicketTypeId
    );
    return t?.quantity || 1;
  }

  addToCart() {
    this.actionMsg = '';
    if (!this.selectedTicketTypeId || this.ticketQuantity < 1) {
      this.actionMsg = 'Please select ticket type and quantity.';
      return;
    }
    if (this.ticketQuantity > this.selectedTicketQuantity) {
      this.actionMsg = `Only ${this.selectedTicketQuantity} tickets available for this type.`;
      return;
    }
    const ticketType = this.event.ticketTypes.find(
      (t: any) => t.id == this.selectedTicketTypeId
    );
    if (!ticketType) {
      this.actionMsg = 'Invalid ticket type selected.';
      return;
    }

    this.ticketCart.addTicket({
      eventId: this.event.id,
      eventName: this.event.name,
      ticketTypeId: ticketType.id,
      ticketTypeName: ticketType.name,
      quantity: this.ticketQuantity,
      price: ticketType.price,
    });

    this.actionMsg = 'Ticket added to cart! Go to Checkout to pay.';
  }
}
