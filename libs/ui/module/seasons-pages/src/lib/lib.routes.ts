import { Route } from '@angular/router';

export const seasonsPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./seasons-pages/seasons-pages.component').then(
        (m) => m.SeasonsPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/seasons-list-page').then(
            (m) => m.seasonsListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/seasons-create-page').then(
            (m) => m.seasonsCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/seasons-edit-page').then(
            (m) => m.seasonsEditPageRoutes
          ),
      },
    ],
  },
];
