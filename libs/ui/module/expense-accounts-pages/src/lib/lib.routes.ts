import { Route } from '@angular/router';

export const expenseAccountsPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./expense-accounts-pages/expense-accounts-pages.component').then(
        (m) => m.ExpenseAccountsPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/expense-accounts-list-page').then(
            (m) => m.expenseAccountsListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/expense-accounts-create-page').then(
            (m) => m.expenseAccountsCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/expense-accounts-edit-page').then(
            (m) => m.expenseAccountsEditPageRoutes
          ),
      },
    ],
  },
];
