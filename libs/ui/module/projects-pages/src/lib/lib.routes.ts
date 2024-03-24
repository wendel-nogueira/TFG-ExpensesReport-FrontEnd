import { Route } from '@angular/router';

export const projectsPagesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./projects-pages/projects-pages.component').then(
        (m) => m.ProjectsPagesComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@expensesreport/projects-list-page').then(
            (m) => m.projectsListPageRoutes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('@expensesreport/projects-create-page').then(
            (m) => m.projectsCreatePageRoutes
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('@expensesreport/projects-edit-page').then(
            (m) => m.projectsEditPageRoutes
          ),
      },
    ],
  },
];
