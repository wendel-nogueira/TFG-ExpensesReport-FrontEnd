import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { ExpenseAccountCategory } from '../../models';
import { CategoryStatus } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class ExpenseAccountCategoryService extends RequestService {
  getAll() {
    return this.httpClient
      .get<ExpenseAccountCategory[]>(`${this.expenseAccountCategoriesApiURL}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  get(id: string) {
    return this.httpClient
      .get<ExpenseAccountCategory>(
        `${this.expenseAccountCategoriesApiURL}/${id}`
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  create(expenseAccountCategory: ExpenseAccountCategory) {
    return this.httpClient
      .post<ExpenseAccountCategory>(
        `${this.expenseAccountCategoriesApiURL}`,
        expenseAccountCategory,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(expenseAccountCategory: ExpenseAccountCategory) {
    return this.httpClient
      .put<ExpenseAccountCategory>(
        `${this.expenseAccountCategoriesApiURL}/${expenseAccountCategory.id}`,
        expenseAccountCategory,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateStatus(id: string, status: CategoryStatus) {
    return this.httpClient
      .patch<ExpenseAccountCategory>(
        `${this.expenseAccountCategoriesApiURL}/${id}/status`,
        { status },
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
