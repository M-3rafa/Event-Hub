import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

export interface TicketTypeStats {
  id: number;
  name: string;
  price: number;
  ticketsSold: number;
  grossRevenue: number;
}

export interface EventStats {
  id: number;
  name: string;
  date: string;
  ticketTypes: TicketTypeStats[];
  totalTicketsSold: number;
  totalGrossRevenue: number;
  totalNetRevenue: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProviderDashboardService {
  private apiUrl = '/api/ProviderDashboard';

  constructor(private http: HttpClient) {}

  getMyEventsStats(): Observable<EventStats[]> {
    return this.http.get<EventStats[]>(
      `${environment.baseUrl}/ProviderDashboard/my-events-stats`
    );
  }
}
