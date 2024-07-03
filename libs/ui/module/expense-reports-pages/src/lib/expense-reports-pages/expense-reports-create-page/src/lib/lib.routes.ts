import { Route } from '@angular/router';
import { ExpenseReportsCreatePageComponent } from './expense-reports-create-page/expense-reports-create-page.component';
import { ExpenseComponent } from './expense-reports-create-page/expenses/expense/expense.component';

export const expenseReportsCreatePageRoutes: Route[] = [
  {
    path: '',
    component: ExpenseReportsCreatePageComponent,
  },
  {
    path: 'expense',
    component: ExpenseComponent,
  },
];
