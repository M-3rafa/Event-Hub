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
}
