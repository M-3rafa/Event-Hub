import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ProviderRequest } from '../../../models/provider-request';

@Injectable({
  providedIn: 'root',
})
export class ProviderRequestService {
  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<ProviderRequest[]> {
    return this.http.get<ProviderRequest[]>(
      `${environment.baseUrl}/Admin/pending-provider-requests`
    );
  }

  approveRequest(id: number): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/approve-provider-request/${id}`,
      {}
    );
  }

  rejectRequest(id: number, note: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/reject-provider-request/${id}`,
      JSON.stringify(note),
      {
        responseType: 'text',
      }
    );
  }
}
