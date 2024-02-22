import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@expensesreport/master-page').then((m) => m.masterPageRoutes),
  },
];
