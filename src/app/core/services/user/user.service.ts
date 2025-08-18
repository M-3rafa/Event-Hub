import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/User/event/${eventId}`);
  }

  getEvents(eventType: string = '', search: string = ''): Observable<any[]> {
    let params = new HttpParams();
    if (eventType) params = params.set('eventType', eventType);
    if (search) params = params.set('search', search);

    return this.http.get<any[]>(`${environment.baseUrl}/User/events`, {
      params,
    });
  }

  getPlaces(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/User/places`);
  }
  getPlaceById(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}/User/place/${id}`);
  }
  getAvailability(placeId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.baseUrl}/Place/${placeId}/availability`
    );
  }

  reservePlace(placeId: string, date: string): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/User/reserve-place`, {
      placeId,
      date,
    });
  }
}
