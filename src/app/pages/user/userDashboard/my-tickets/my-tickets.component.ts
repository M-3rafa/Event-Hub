import { Component, OnInit } from '@angular/core';
import { MyTicketsService } from '../../../../core/services/ticket/my-tickets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tickets',
  imports: [CommonModule],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss',
})
export class MyTicketsComponent implements OnInit {
  tickets: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private myTicketsService: MyTicketsService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.myTicketsService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load tickets.';
        this.loading = false;
      },
    });
  }

  downloadTicketPdf(ticketId: number) {
    this.myTicketsService.downloadTicketPdf(ticketId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${ticketId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Could not download ticket PDF.');
      },
    });
  }
}
