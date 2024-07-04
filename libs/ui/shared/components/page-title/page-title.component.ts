import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  DashboardComponent,
  UserGroupComponent,
  DepartmentComponent,
  ProjectComponent,
  FileComponent,
  WalletComponent,
  CalendarComponent,
  TagComponent,
} from '../icons/index';

@Component({
  selector: 'expensesreport-page-title',
  standalone: true,
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.css',
  imports: [
    CommonModule,
    DashboardComponent,
    UserGroupComponent,
    DepartmentComponent,
    ProjectComponent,
    FileComponent,
    WalletComponent,
    CalendarComponent,
    TagComponent,
  ],
})
export class PageTitleComponent implements OnInit {
  title = '';
  icon = '';

  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getTitle();
      }
    });
  }

  ngOnInit() {
    this.getTitle();
  }

  getTitle() {
    const route = this.router.url.split('/') || [];
    let title = '';
    let icon = '';

    const actionMappings = {
      create: 'create ',
      edit: 'edit ',
    };

    const entityMappings = {
      users: { title: 'users', icon: 'user' },
      projects: { title: 'projects', icon: 'project' },
      departments: { title: 'departments', icon: 'department' },
      'expense-accounts': { title: 'accounts', icon: 'account' },
      'expense-reports': { title: 'reports', icon: 'report' },
      expenses: { title: 'expenses', icon: 'expense' },
      categories: { title: 'categories', icon: 'tag' },
      seasons: { title: 'seasons', icon: 'calendar' },
    };

    for (const action in actionMappings) {
      if (route.includes(action)) {
        title = actionMappings[action as keyof typeof actionMappings];
        break;
      }
    }

    if (title === '' && route.length === 2) {
      title = 'manage ';
    }

    for (const entity in entityMappings) {
      if (route.includes(entity)) {
        title += entityMappings[entity as keyof typeof entityMappings].title;
        icon = entityMappings[entity as keyof typeof entityMappings].icon;
        break;
      }
    }

    if (title !== '') {
      this.title = title;
      this.icon = icon;
    } else {
      this.title = 'home';
      this.icon = 'home';
    }
  }
}
