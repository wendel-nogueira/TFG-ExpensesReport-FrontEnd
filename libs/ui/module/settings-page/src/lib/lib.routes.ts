import { Route } from '@angular/router';

export const settingsPageRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@expensesreport/settings-page').then(
        (m) => m.SettingsPageComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./settings-page/modules/account/account.component').then(
            (m) => m.AccountComponent
          ),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./settings-page/modules/security/security.component').then(
            (m) => m.SecurityComponent
          ),
      },
    ],
  },
];
