import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../../models/event';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEvents(filterst: string): Observable<Event[]> {
    return this.http.get<Event[]>(
      `${environment.baseUrl}/Admin/all-events/${filterst}`,
      {}
    );
  }

  getPendingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(
      `${environment.baseUrl}/Admin/pending-events`
    );
  }

  approveEvent(id: number): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/approve-event/${id}`,
      {}
    );
  }

  rejectEvent(id: number, note: string): Observable<string> {
    return this.http.post(
      `${environment.baseUrl}/Admin/reject-event/${id}`,
      JSON.stringify(note),
      {
        headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
        responseType: 'text',
      }
    );
  }
}
