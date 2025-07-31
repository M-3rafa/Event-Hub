import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MyTicketsService {
  constructor(private http: HttpClient) {}

  getMyTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/User/my-tickets`);
  }

  downloadTicketPdf(ticketId: number): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/User/ticket-pdf/${ticketId}`, {
      responseType: 'blob',
    });
  }
}
