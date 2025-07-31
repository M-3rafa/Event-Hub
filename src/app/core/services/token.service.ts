import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  private hasToken(): boolean {
    if (this.isBrowser()) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedInSubject.next(true);
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  saveUser(userName: string, email: string, roles: string[]): void {
    const user = { userName, email, roles };
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    if (this.isBrowser()) {
      const data = localStorage.getItem(this.userKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.hasToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.loggedInSubject.next(true);
  }
  constructor() {}
}
