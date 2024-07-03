import { Route } from '@angular/router';

export const categoriesPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./categories-pages/categories-pages.component').then(
        (m) => m.CategoriesPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/categories-list-page').then(
            (m) => m.categoriesListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/categories-create-page').then(
            (m) => m.categoriesCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/categories-edit-page').then(
            (m) => m.categoriesEditPageRoutes
          ),
      },
    ],
  },
];
