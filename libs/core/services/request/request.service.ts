import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environments } from '../../../../apps/expensesreport/src/environments/environments';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  public constructor(
    public httpClient: HttpClient,
    public router: Router,
    public jwtHelper: JwtHelperService
  ) {}

  public addressApiExternal = environments.addressApiExternal;
  public authenticationApiURL = environments.authenticationApiURL;
  public usersApiURL = environments.usersApiURL;
  public departmentsApiURL = environments.departmentsApiURL;
  public projectsApiURL = environments.projectsApiURL;
  public seasonsApiURL = environments.seasonsApiURL;
  public expensesApiURL = environments.expensesApiURL;
  public expenseReportsApiURL = environments.expenseReportsApiURL;
  public expenseAccountsApiURL = environments.expenseAccountsApiURL;
  public expenseAccountCategoriesApiURL =
    environments.expenseAccountCategoriesApiURL;
  public filesApiURL = environments.filesApiURL;

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

    if (error.status === 403) {
      this.router.navigate(['/404']);
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
