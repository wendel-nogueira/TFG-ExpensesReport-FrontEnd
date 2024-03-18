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
    data: { rolesAllowed: ['FieldStaff', 'Manager', 'Accountant'] },
    children: [
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
        path: 'settings',
        loadChildren: () =>
          import('@expensesreport/settings-page').then(
            (m) => m.settingsPageRoutes
          ),
      },
    ],
  },
];
