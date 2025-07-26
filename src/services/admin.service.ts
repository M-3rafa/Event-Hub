import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPendingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(
      `${environment.baseUrl}/Admin/pending-events`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  approveEvent(id: number): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/approve-event/${id}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
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
