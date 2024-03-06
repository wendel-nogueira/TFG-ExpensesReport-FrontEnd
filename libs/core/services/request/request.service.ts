import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environments } from '../../../../apps/expensesreport/src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  public constructor(public httpClient: HttpClient, public router: Router) {}

  public identityApiURL = environments.identityApiURL;

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    }),
  };

  public handleError(error: HttpErrorResponse) {
    const errorMessage = {
      code: error.status,
      message: '',
      errors: [],
    };

    if (error.status === 401) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

    if (error.error instanceof ErrorEvent) {
      errorMessage.message = error.error.message;
    } else {
      errorMessage.message = error.message;
      errorMessage.errors = error.error.errors;
    }

    return throwError(errorMessage);
  }
}
