import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Place, PlaceAvailability } from '../../../models/place';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private http: HttpClient) {}

  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.baseUrl}/Admin/places`, {});
  }

  approvePlace(id: number): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/approve-place/${id}`,
      {}
    );
  }

  rejectPlace(id: number, reason: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/Admin/reject-place/${id}`, {
      adminNote: reason,
    });
  }

  getAvailabilities(placeId: number): Observable<PlaceAvailability[]> {
    return this.http.get<PlaceAvailability[]>(
      `${environment.baseUrl}/Admin/place-availability/${placeId}`
    );
  }

  getFullUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    // Remove trailing '/api' from baseUrl if present
    const cleanBaseUrl = environment.baseUrl.replace(/\/api\/?$/, '');

    return url.startsWith('http') ? url : `${cleanBaseUrl}${url}`;
  }
}
