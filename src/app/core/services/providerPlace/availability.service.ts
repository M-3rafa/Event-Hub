import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaceAvailability } from '../../../models/place';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  getAvailability(placeId: number): Observable<PlaceAvailability[]> {
    return this.http.get<PlaceAvailability[]>(
      `${environment.baseUrl}/Place/${placeId}/availability`
    );
  }
  blockDate(placeId: number, date: Date): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Place/${placeId}/availability/block`,
      [date]
    );
  }

  unblockDateById(blockId: number): Observable<any> {
    return this.http.delete(
      `${environment.baseUrl}/Place/availability/${blockId}`
    );
  }
}
