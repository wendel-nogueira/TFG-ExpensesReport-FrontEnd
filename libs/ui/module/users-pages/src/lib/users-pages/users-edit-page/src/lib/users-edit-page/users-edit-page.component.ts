import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AuthService,
  ToastService,
  UserService,
} from '@expensesreport/services';
import {
  TabMenuComponent,
  TableColumn,
  TablePageComponent,
  SelectItem,
} from '@expensesreport/ui';
import { User } from '@expensesreport/models';
import { MenuItem } from 'primeng/api';
import { EditComponent } from './edit/edit.component';
import { UserRoles, UserStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-users-edit-page',
  standalone: true,
  templateUrl: './users-edit-page.component.html',
  styleUrl: './users-edit-page.component.css',
  imports: [CommonModule, TabMenuComponent, EditComponent, TablePageComponent],
})
export class UsersEditPageComponent implements OnInit {
  id: string | null = null;
  user: User | null = null;
  supervised: User[] = [];
  supervisors: User[] = [];
  allUsers: User[] = [];

  columns: TableColumn[] = columns;
  supervisorsRows: TableRows[] = [];
  supervisedRows: TableRows[] = [];
  totalSupervisorsRecords = 0;
  totalSupervisedRecords = 0;

  supervisorsItems: SelectItem[] = [];
  supervisedItems: SelectItem[] = [];

  loading = false;
  disabled = false;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getSessionData()?.nameid;
    const role = this.authService.getSessionData()?.role;

    if (!role) this.toastService.showError('Session expired');

    if (!role || (role !== 'Admin' && role !== 'Accountant'))
      this.router.navigate(['/']);

    this.id = this.router.url.split('/').pop() || null;

    if (!this.id || this.id === null) {
      this.toastService.showError('User not found');
      this.router.navigate(['/users']);
      return;
    }

    this.loading = true;

    this.items = [
      { label: 'edit', icon: 'pi pi-pencil' },
      { label: 'supervisors', icon: 'pi pi-users' },
      { label: 'supervised', icon: 'pi pi-users' },
    ];
    this.activeItem = this.items[0];

    this.userService.getAll().subscribe(
      (users) => {
        this.allUsers = users.filter(
          (u) =>
            u.id !== userId &&
            (u.identity?.role === UserRoles.Manager ||
              u.identity?.role === UserRoles.FieldStaff)
        );

        if (this.id)
          this.userService.getUser(this.id).subscribe(
            (user) => {
              if (!user) this.toastService.showError('User not found');

              if (user.identityId === userId)
                this.toastService.showError('You cannot edit your own user');

              if (!user || user.identityId === userId) {
                this.router.navigate(['/users']);
                return;
              }

              this.user = user;

              this.supervisors = users.filter((u) =>
                user.supervisors?.find((s) => s.id === u.id)
              );
              this.supervised = users.filter((u) =>
                user.supervised?.find((s) => s.id === u.id)
              );

              this.getRows();
              this.getItems();

              this.loading = false;
            },
            (error) => {
              throw new Error(error);
            }
          );
      },
      (error) => {
        this.toastService.showError(error);
        this.router.navigate(['/users']);
      }
    );
  }

  activeItemChange(item: MenuItem) {
    this.activeItem = item;
  }

  getRows() {
    this.supervisorsRows = [];
    this.supervisedRows = [];

    this.supervisorsRows = this.supervisors.map((supervisor) => ({
      id: supervisor.id || '',
      code: supervisor.code || '',
      name: `${supervisor.firstName} ${supervisor.lastName}`,
      email: supervisor.identity?.email || '',
      address: `${supervisor.address}, ${supervisor.city} - ${supervisor.state}, ${supervisor.country} - ${supervisor.zip}`,
      role:
        supervisor.identity?.role !== undefined
          ? UserRoles[supervisor.identity?.role]
          : '',
      status:
        supervisor.identity?.status !== undefined
          ? UserStatus[supervisor.identity?.status]
          : '',
    }));

    this.supervisedRows = this.supervised.map((supervised) => ({
      id: supervised.id || '',
      code: supervised.code || '',
      name: `${supervised.firstName} ${supervised.lastName}`,
      email: supervised.identity?.email || '',
      address: `${supervised.address}, ${supervised.city} - ${supervised.state}, ${supervised.country} - ${supervised.zip}`,
      role:
        supervised.identity?.role !== undefined
          ? UserRoles[supervised.identity?.role]
          : '',
      status:
        supervised.identity?.status !== undefined
          ? UserStatus[supervised.identity?.status]
          : '',
    }));

    this.totalSupervisorsRecords = this.supervisorsRows.length;
    this.totalSupervisedRecords = this.supervisedRows.length;
  }

  getItems() {
    this.supervisorsItems = [];
    this.supervisedItems = [];

    this.allUsers.forEach((user) => {
      if (
        this.supervisors.find((s) => s.id === user.id) ||
        this.user?.id === user.id
      )
        return;

      this.supervisorsItems.push({
        label: `${user.firstName} ${user.lastName} ${
          user.identity?.role && '- ' + UserRoles[user.identity?.role]
        }`,
        value: user.id || '',
      });
    });

    this.allUsers.forEach((user) => {
      if (
        this.supervised.find((s) => s.id === user.id) ||
        this.user?.id === user.id
      )
        return;

      this.supervisedItems.push({
        label: `${user.firstName} ${user.lastName} ${
          user.identity?.role && '- ' + UserRoles[user.identity?.role]
        }`,
        value: user.id || '',
      });
    });
  }

  addSupervisors(supervisors: SelectItem[]) {
    this.userService
      .addSupervisors(
        this.id || '',
        supervisors.map((s) => s.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Supervisors added successfully');

          this.supervisors = this.supervisors.concat(
            this.allUsers.filter((u) =>
              supervisors.find((s) => s.value === u.id)
            )
          );

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while adding supervisors'
          );
          this.loading = false;
        }
      );
  }

  addSupervised(supervised: SelectItem[]) {
    this.userService
      .addSupervised(
        this.id || '',
        supervised.map((s) => s.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Supervised added successfully');

          this.supervised = this.supervised.concat(
            this.allUsers.filter((u) =>
              supervised.find((s) => s.value === u.id)
            )
          );

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while adding supervised'
          );
          this.loading = false;
        }
      );
  }

  removeSupervisors(supervisors: TableRows[]) {
    this.loading = true;

    const supervisorIds = supervisors.map((s) => s.id || '');

    this.userService.removeSupervisors(this.id || '', supervisorIds).subscribe(
      () => {
        this.toastService.showSuccess('Supervisors removed successfully');

        this.supervisors = this.supervisors.filter(
          (s) => !supervisorIds.includes(s.id || '')
        );

        this.getRows();
        this.getItems();

        this.loading = false;
      },
      () => {
        this.toastService.showError(
          'An error occurred while removing supervisors'
        );
        this.loading = false;
      }
    );
  }

  removeSupervised(supervised: TableRows[]) {
    this.loading = true;

    const supervisedIds = supervised.map((s) => s.id || '');

    this.userService.removeSupervised(this.id || '', supervisedIds).subscribe(
      () => {
        this.toastService.showSuccess('Supervised removed successfully');

        this.supervised = this.supervised.filter(
          (s) => !supervisedIds.includes(s.id || '')
        );

        this.getRows();
        this.getItems();

        this.loading = false;
      },
      () => {
        this.toastService.showError(
          'An error occurred while removing supervised'
        );
        this.loading = false;
      }
    );
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
    filterValues: ['Admin', 'FieldStaff', 'Manager', 'Accountant'],
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
