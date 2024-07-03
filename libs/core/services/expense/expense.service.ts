import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { Expense } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends RequestService {
  approveExpense(id: string, approval: any) {
    return this.httpClient
      .patch<Expense>(`${this.expensesApiURL}/${id}/approval`, approval)
      .pipe(catchError(this.handleError));
  }
}
