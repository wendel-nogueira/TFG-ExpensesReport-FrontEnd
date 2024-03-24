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

    if (route.includes('create')) {
      title = 'create ';
    } else if (route.includes('edit')) {
      title = 'edit ';
    } else if (route.length === 2) {
      title = 'manage ';
    }

    if (route.includes('users')) {
      title += 'users';
      icon = 'user';
    } else if (route.includes('projects')) {
      title += 'projects';
      icon = 'project';
    } else if (route.includes('departments')) {
      title += 'departments';
      icon = 'department';
    } else if (route.includes('expense-accounts')) {
      title += 'accounts';
      icon = 'account';
    } else if (route.includes('expense-reports')) {
      title += 'reports';
      icon = 'report';
    } else if (route.includes('expenses')) {
      title += 'expenses';
      icon = 'expense';
    }

    if (title !== '') {
      this.title = title;
      this.icon = icon;
      return;
    }

    this.title = 'home';
    this.icon = 'home';
  }
}
