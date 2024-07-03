import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';
import {
  AuthService,
  ToastService,
  UserService,
} from '@expensesreport/services';
import { UserRoles, UserStatus, roleToName } from '@expensesreport/enums';
import { User } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-users-list-page',
  standalone: true,
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.css',
  imports: [
    CommonModule,
    TableComponent,
    OverlayPanelModule,
    ViewComponent,
    RouterModule,
  ],
})
export class UsersListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  users: TableRows[] = [];
  totalRecords = 0;
  loading = false;

  dataClicked: TableRows | null = null;

  showOverlayPanel = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getSessionData()?.nameid;

    this.loading = true;

    this.userService.getAll().subscribe(
      (users) => {
        const user = localStorage.getItem('user') || '{}';
        const userInfo = (JSON.parse(user) as User) || {};

        let allUsers: TableRows[] = [];

        if (
          userInfo.identity?.role !== UserRoles.Accountant &&
          userInfo.identity?.role !== UserRoles.Admin
        ) {
          const supervisors = userInfo.supervisors?.map((s) => s.id) || [];
          const supervisees = userInfo.supervised?.map((s) => s.id) || [];

          console.log('supervisors', supervisors);
          console.log('supervisees', supervisees);

          allUsers = users
            .filter(
              (u) =>
                u.id !== userId &&
                (supervisors.includes(u.id) || supervisees.includes(u.id)) &&
                u.identity?.status !== UserStatus.Deleted &&
                u.identity?.status !== UserStatus.Inactive
            )
            .map((u) => {
              return {
                id: u.id || '',
                code: u.code || '',
                name: `${u.firstName} ${u.lastName}`,
                email: u.identity?.email || '',
                address: `${u.address}, ${u.city} - ${u.state}, ${u.country} - ${u.zip}`,
                role:
                  u.identity?.role !== undefined
                    ? roleToName(u.identity?.role)
                    : '',
                status:
                  u.identity?.status !== undefined
                    ? UserStatus[u.identity?.status]
                    : '',
              };
            });
        } else {
          allUsers = users
            .filter((u) => u.id !== userId)
            .map((u) => {
              return {
                id: u.id || '',
                code: u.code || '',
                name: `${u.firstName} ${u.lastName}`,
                email: u.identity?.email || '',
                address: `${u.address}, ${u.city} - ${u.state}, ${u.country} - ${u.zip}`,
                role:
                  u.identity?.role !== undefined
                    ? roleToName(u.identity?.role)
                    : '',
                status:
                  u.identity?.status !== undefined
                    ? UserStatus[u.identity?.status]
                    : '',
              };
            });

          this.showOverlayPanel = true;
        }

        this.users = allUsers;
        this.totalRecords = allUsers.length;
        this.loading = false;
      },
      () => {
        console.log('An error occurred');
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }

  onClickMore(
    event: { event: PointerEvent; data: TableRows },
    op: OverlayPanel
  ) {
    this.dataClicked = event.data;
    op.toggle(event.event);
  }
}

const columns: TableColumn[] = [
  { field: 'code', header: 'code' },
  { field: 'name', header: 'name', sortable: true },
  { field: 'email', header: 'email', sortable: true },
  { field: 'address', header: 'address' },
  {
    field: 'role',
    header: 'role',
    filter: true,
    filterValues: ['Admin', 'Field Staff', 'Manager', 'Accountant'],
    sortable: true,
  },
  {
    field: 'status',
    header: 'status',
    filter: true,
    filterValues: ['active', 'inactive', 'deleted'],
    sortable: true,
  },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  code: string;
  name: string;
  email: string;
  address: string;
  role: string;
  status: string;
}
