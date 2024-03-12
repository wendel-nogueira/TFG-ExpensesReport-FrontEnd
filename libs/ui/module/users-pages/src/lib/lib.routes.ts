import { Route } from '@angular/router';

export const usersPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./users-pages/users-pages.component').then(
        (m) => m.UsersPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/users-list-page').then(
            (m) => m.usersListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/users-create-page').then(
            (m) => m.usersCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/users-edit-page').then(
            (m) => m.usersEditPageRoutes
          ),
      },
    ],
  },
];
