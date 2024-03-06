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
      import('@expensesreport/change-password-page').then(
        (m) => m.changePasswordPageRoutes
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('@expensesreport/register-page').then((m) => m.registerPageRoutes),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@expensesreport/not-found-page').then(
        (m) => m.notFoundPageRoutes
      ),
  },
];
