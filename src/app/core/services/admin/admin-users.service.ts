import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { User } from '../../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  constructor(private http: HttpClient) {}

  getAllUsers(searchTerm = '', email = '', role = ''): Observable<User[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('name', searchTerm);
    if (email) params = params.set('email', email);
    if (role) params = params.set('role', role);

    return this.http.get<User[]>(`${environment.baseUrl}/Admin/all-users`, {
      params,
    });
  }

  makeAdmin(userName: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/make-admin-by-username/${userName}`,
      {}
    );
  }

  removeAdmin(userName: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/remove-admin-by-username/${userName}`,
      {}
    );
  }

  removeServiceProvider(userName: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/Admin/remove-service-provider/${userName}`,
      {}
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/Admin/delete-user/${id}`);
  }
}
