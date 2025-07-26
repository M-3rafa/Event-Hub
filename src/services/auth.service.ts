import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterModel } from '../models/register.model';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { LoginModel } from '../models/login-model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  register(model: RegisterModel): Observable<any> {
    return this.http.post(`${environment.baseUrl}/Auth/register`, model);
  }

  login(model: LoginModel): Observable<any> {
    return this.http.post(`${environment.baseUrl}/Auth/login`, model);
  }

  becomeServiceProvider(): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(
      `${environment.baseUrl}/Auth/become-provider`,
      {},
      { headers }
    );
  }

  logout(): void {
    this.tokenService.logout();
  }
}
