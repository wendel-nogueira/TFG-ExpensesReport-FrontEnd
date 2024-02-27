import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@expensesreport/master-page').then((m) => m.masterPageRoutes),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@expensesreport/login-page').then((m) => m.loginPageRoutes),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('@expensesreport/change-password-page').then((m) => m.changePasswordPageRoutes),
  },
];
