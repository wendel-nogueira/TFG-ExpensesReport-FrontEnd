import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environments } from '../../../../apps/expensesreport/src/environments/environments';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiUrls = Object.keys(environments as object)
      .filter((key: string) => {
        return (
          key.includes('ApiURL') &&
          environments[key as keyof typeof environments] !== ''
        );
      })
      .map((key: string) => environments[key as keyof typeof environments]);

    const containsBearer = request.headers.has('Authorization');

    if (!containsBearer && apiUrls.some((url) => request.url.includes(url.toString()))) {
      const token = this.authService.getSession();

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401)
              this.authService.refreshToken().subscribe(
                (auth) => {
                  this.authService.createSession(auth);

                  request = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${auth.token}`,
                    },
                  });

                  return next.handle(request);
                },
                () => {
                  this.authService.logout();
                }
              );

            return next.handle(request);
          })
        );
      }
    }

    return next.handle(request);
  }
}
