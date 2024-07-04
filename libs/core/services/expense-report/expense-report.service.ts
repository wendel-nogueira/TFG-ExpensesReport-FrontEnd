import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { ExpenseReport, Signature } from '../../models';
import { ExpenseReportStatus } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class ExpenseReportService extends RequestService {
  getAll() {
    return this.httpClient
      .get<ExpenseReport[]>(`${this.expenseReportsApiURL}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getById(id: string) {
    return this.httpClient
      .get<ExpenseReport>(`${this.expenseReportsApiURL}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  create(expenseReport: ExpenseReport) {
    return this.httpClient
      .post<ExpenseReport>(this.expenseReportsApiURL, expenseReport)
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(expenseReport: ExpenseReport) {
    return this.httpClient
      .put<ExpenseReport>(
        `${this.expenseReportsApiURL}/${expenseReport.id}`,
        expenseReport
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateStatus(
    id: string,
    {
      status,
      notes,
    }: {
      status: ExpenseReportStatus;
      notes?: string;
    }
  ) {
    return this.httpClient
      .patch<ExpenseReport>(`${this.expenseReportsApiURL}/${id}/status`, {
        status,
        notes,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  sign(id: string, signature: Signature) {
    return this.httpClient
      .post<ExpenseReport>(`${this.expenseReportsApiURL}/${id}/sign`, signature)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateApproval(
    id: string,
    update: {
      isApproved: boolean;
      notes: string;
    }
  ) {
    return this.httpClient
      .patch<ExpenseReport>(
        `${this.expenseReportsApiURL}/${id}/approval`,
        update
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  pay(id: string, payment: any) {
    return this.httpClient
      .patch<ExpenseReport>(`${this.expenseReportsApiURL}/${id}/pay`, payment)
      .pipe(catchError(this.handleError.bind(this)));
  }

  rejectPayment(id: string, notes: string) {
    return this.httpClient
      .patch<ExpenseReport>(
        `${this.expenseReportsApiURL}/${id}/reject-payment`,
        {
          rejectionNotes: notes,
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
