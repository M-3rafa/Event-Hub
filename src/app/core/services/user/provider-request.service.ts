import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProviderRequestService {
  constructor(private http: HttpClient) {}

  requestServiceProvider(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Ahtu/request-service-provider`,
      formData,
      {}
    );
  }
}
