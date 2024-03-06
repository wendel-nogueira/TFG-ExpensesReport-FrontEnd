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
    children: [],
  },
];
