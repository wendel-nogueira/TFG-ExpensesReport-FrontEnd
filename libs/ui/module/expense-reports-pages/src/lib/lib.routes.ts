import { Route } from '@angular/router';

export const expenseReportsPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./expense-reports-pages/expense-reports-pages.component').then(
        (m) => m.ExpenseReportsPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/expense-reports-list-page').then(
            (m) => m.expenseReportsListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/expense-reports-create-page').then(
            (m) => m.expenseReportsCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/expense-reports-edit-page').then(
            (m) => m.expenseReportsEditPageRoutes
          ),
      },
    ],
  },
];
