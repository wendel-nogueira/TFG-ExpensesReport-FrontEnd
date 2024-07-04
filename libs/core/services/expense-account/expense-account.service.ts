import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { ExpenseAccount } from '../../models';
import { ExpenseAccountStatus, ExpenseAccountType } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class ExpenseAccountService extends RequestService {
  getAll() {
    return this.httpClient
      .get<ExpenseAccount[]>(`${this.expenseAccountsApiURL}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  get(id: string) {
    return this.httpClient
      .get<ExpenseAccount>(`${this.expenseAccountsApiURL}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  checkIfCodeExists(code: string) {
    return this.httpClient.get<boolean>(
      `${this.expenseAccountsApiURL}/code/${code}`,
      this.httpOptions
    );
  }

  create(expenseAccount: ExpenseAccount) {
    return this.httpClient
      .post<ExpenseAccount>(
        `${this.expenseAccountsApiURL}`,
        expenseAccount,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(expenseAccount: ExpenseAccount) {
    return this.httpClient
      .put<ExpenseAccount>(
        `${this.expenseAccountsApiURL}/${expenseAccount.id}`,
        expenseAccount,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateStatus(id: string, status: ExpenseAccountStatus) {
    return this.httpClient
      .patch<ExpenseAccount>(
        `${this.expenseAccountsApiURL}/${id}/status`,
        { status },
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
