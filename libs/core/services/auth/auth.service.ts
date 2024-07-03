import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Auth, TokenData } from '../../models/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RequestService {
  login(email: string, password: string): Observable<Auth> {
    const body = {
      email,
      password,
    };

    return this.httpClient
      .post<Auth>(
        `${this.authenticationApiURL}/login`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  loginWithGoogle(token: string): Observable<Auth> {
    return this.httpClient
      .post<Auth>(
        `${this.authenticationApiURL}/login/google`,
        JSON.stringify({ token: token }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<Auth> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logout();
    }

    return this.httpClient
      .post<Auth>(
        `${this.authenticationApiURL}/refresh-token?refreshToken=${refreshToken}`,
        null,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  createSession(auth: Auth) {
    localStorage.setItem('token', auth.token);

    if (auth.refreshToken && auth.refreshToken !== '') {
      localStorage.setItem('refreshToken', auth.refreshToken);
    }
  }

  getSession(redirect = true): string | null {
    const token = localStorage.getItem('token');

    if (token) {
      return token;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    if (redirect) {
      this.router.navigate(['/login']);
    }

    return null;
  }

  decodeToken(token: string): TokenData | null {
    const tokenData = this.jwtHelper.decodeToken(token);

    if (tokenData) {
      return tokenData as TokenData;
    }

    return null;
  }

  isExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  getSessionData(): TokenData | null {
    const token = this.getSession();

    if (token) {
      const tokenData = this.decodeToken(token);

      if (tokenData) {
        return tokenData;
      }

      this.refreshToken().subscribe((auth) => {
        this.createSession(auth);
      });
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}
