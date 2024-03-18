import { Route } from '@angular/router';

export const departmentsPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./departments-pages/departments-pages.component').then(
        (m) => m.DepartmentsPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/departments-list-page').then(
            (m) => m.departmentsListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/departments-create-page').then(
            (m) => m.departmentsCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/departments-edit-page').then(
            (m) => m.departmentsEditPageRoutes
          ),
      },
    ],
  },
];
