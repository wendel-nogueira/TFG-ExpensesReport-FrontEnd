import { Route } from '@angular/router';
import { IsAuthGuard } from '@expensesreport/guards';

export const masterPageRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./master-page/master-page.component').then(
        (m) => m.MasterPageComponent
      ),
    canActivate: [IsAuthGuard],
    data: { rolesAllowed: ['FieldStaff', 'Manager', 'Accountant', 'Admin'] },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/dashboard-page').then(
            (m) => m.dashboardPageRoutes
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('@expensesreport/users-pages').then((m) => m.usersPagesRoutes),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('@expensesreport/departments-pages').then(
            (m) => m.departmentsPagesRoutes
          ),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('@expensesreport/projects-pages').then(
            (m) => m.projectsPagesRoutes
          ),
      },
      {
        path: 'seasons',
        loadChildren: () =>
          import('@expensesreport/seasons-pages').then(
            (m) => m.seasonsPagesRoutes
          ),
      },
      {
        path: 'expense-accounts',
        loadChildren: () =>
          import('@expensesreport/expense-accounts-pages').then(
            (m) => m.expenseAccountsPagesRoutes
          ),
      },
      {
        path: 'expense-reports',
        loadChildren: () =>
          import('@expensesreport/expense-reports-pages').then(
            (m) => m.expenseReportsPagesRoutes
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('@expensesreport/categories-pages').then(
            (m) => m.categoriesPagesRoutes
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@expensesreport/settings-page').then(
            (m) => m.settingsPageRoutes
          ),
      },
    ],
  },
];
