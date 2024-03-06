import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenData } from '../../models/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RequestService {
  login(email: string, password: string): Observable<any> {
    const body = {
      email,
      password,
    };

    return this.httpClient
      .post<{
        token: string;
      }>(`${this.identityApiURL}/login`, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  createSession(token: string) {
    localStorage.setItem('token', token);
  }

  getSession(redirect = true): string | null {
    const token = localStorage.getItem('token');

    if (token) {
      return token;
    }

    localStorage.removeItem('token');

    if (redirect) {
      this.router.navigate(['/login']);
    }

    return null;
  }

  getSessionData(): TokenData | null {
    const token = this.getSession();

    if (token) {
      const tokenData = token.split('.')[1];
      const decodedTokenData = window.atob(tokenData);
      const tokenDataObject = JSON.parse(decodedTokenData) as TokenData;

      if (new Date(tokenDataObject.exp * 1000) < new Date()) {
        this.logout();
        return null;
      }

      return JSON.parse(decodedTokenData) as TokenData;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}
