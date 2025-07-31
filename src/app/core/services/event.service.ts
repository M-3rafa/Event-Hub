import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getMyEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/Event/my-events`);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/Event/${id}`);
  }

  addEvent(formData: FormData): Observable<any> {
    return this.http.post(`${environment.baseUrl}/Event/add-event`, formData);
  }

  editEvent(id: number, formData: FormData): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/Event/edit-event/${id}`,
      formData
    );
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/Event/delete-event/${id}`);
  }
}
