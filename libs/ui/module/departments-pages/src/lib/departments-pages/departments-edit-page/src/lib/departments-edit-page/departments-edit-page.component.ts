import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TabMenuComponent,
  TableColumn,
  TablePageComponent,
  SelectItem,
} from '@expensesreport/ui';
import { Router } from '@angular/router';
import { Department, User } from '@expensesreport/models';
import { MenuItem } from 'primeng/api';
import {
  DepartmentService,
  ToastService,
  UserService,
} from '@expensesreport/services';
import { UserRoles, UserStatus } from '@expensesreport/enums';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'expensesreport-departments-edit-page',
  standalone: true,
  templateUrl: './departments-edit-page.component.html',
  styleUrl: './departments-edit-page.component.css',
  imports: [CommonModule, TabMenuComponent, EditComponent, TablePageComponent],
})
export class DepartmentsEditPageComponent implements OnInit {
  id: string | null = null;
  department: Department | null = null;
  allUsers: User[] = [];
  employees: string[] = [];
  managers: string[] = [];

  columns: TableColumn[] = columns;
  managersRows: TableRows[] = [];
  employeesRows: TableRows[] = [];
  totalManagersRecords = 0;
  totalEmployeesRecords = 0;

  managersItems: SelectItem[] = [];
  employeesItems: SelectItem[] = [];

  loading = false;
  disabled = false;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.router.url.split('/').pop() || null;

    if (!this.id) {
      this.toastService.showError('Department not found');
      this.router.navigate(['/departments']);
      return;
    }

    this.loading = true;

    this.items = [
      { label: 'edit', icon: 'pi pi-pencil' },
      { label: 'managers', icon: 'pi pi-users' },
      { label: 'employees', icon: 'pi pi-users' },
    ];
    this.activeItem = this.items[0];

    this.userService.getAll().subscribe(
      (users) => {
        this.allUsers = users.filter(
          (user) =>
            user.identity?.role === UserRoles.Manager ||
            user.identity?.role === UserRoles.FieldStaff
        );

        if (this.id !== null)
          this.departmentService.get(this.id).subscribe(
            (department) => {
              this.department = department;

              this.managers = department.managers || [];
              this.employees = department.employees || [];

              this.getRows();
              this.getItems();

              this.loading = false;
            },
            (error) => {
              console.error(error);
              throw new Error(error);
            }
          );
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }

  activeItemChange(item: MenuItem) {
    this.activeItem = item;
  }

  getRows() {
    this.managersRows = [];
    this.employeesRows = [];

    this.allUsers.forEach((user) => {
      if (!this.managers.includes(user.id || '')) return;

      this.managersRows.push({
        id: user.id || '',
        code: user.code || '',
        name: `${user.firstName} ${user.lastName}`,
        email: user.identity?.email || '',
        address: user.address || '',
        role:
          user.identity?.role !== undefined
            ? UserRoles[user.identity?.role]
            : '',
        status:
          user.identity?.status !== undefined
            ? UserStatus[user.identity?.status]
            : '',
      });
    });

    this.allUsers.forEach((user) => {
      if (!this.employees.includes(user.id || '')) return;

      this.employeesRows.push({
        id: user.id || '',
        code: user.code || '',
        name: `${user.firstName} ${user.lastName}`,
        email: user.identity?.email || '',
        address: user.address || '',
        role:
          user.identity?.role !== undefined
            ? UserRoles[user.identity?.role]
            : '',
        status:
          user.identity?.status !== undefined
            ? UserStatus[user.identity?.status]
            : '',
      });
    });

    this.totalManagersRecords = this.managersRows.length;
    this.totalEmployeesRecords = this.employeesRows.length;
  }

  getItems() {
    this.managersItems = [];
    this.employeesItems = [];

    this.allUsers.forEach((user) => {
      if (this.managers.includes(user.id || '')) return;

      this.managersItems.push({
        label: `${user.firstName} ${user.lastName} ${
          user.identity?.role && '- ' + UserRoles[user.identity?.role]
        }`,
        value: user.id || '',
      });
    });

    this.allUsers.forEach((user) => {
      if (this.employees.includes(user.id || '')) return;

      this.employeesItems.push({
        label: `${user.firstName} ${user.lastName} ${
          user.identity?.role && '- ' + UserRoles[user.identity?.role]
        }`,
        value: user.id || '',
      });
    });
  }

  addManagers(managers: SelectItem[]) {
    this.loading = true;

    this.departmentService
      .addManagers(
        this.id || '',
        managers.map((m) => m.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Managers added successfully');

          this.managers = this.managers.concat(managers.map((m) => m.value));

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while adding managers'
          );
          this.loading = false;
        }
      );
  }

  addEmployees(employees: SelectItem[]) {
    this.loading = true;

    this.departmentService
      .addEmployees(
        this.id || '',
        employees.map((e) => e.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Employees added successfully');

          this.employees = this.employees.concat(employees.map((e) => e.value));

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while adding employees'
          );
          this.loading = false;
        }
      );
  }

  removeManagers(managers: TableRows[]) {
    this.loading = true;

    const managersIds = managers.map((m) => m.id || '');

    this.departmentService.removeManagers(this.id || '', managersIds).subscribe(
      () => {
        this.toastService.showSuccess('Managers removed successfully');
        this.managers = this.managers.filter((m) => !managersIds.includes(m));

        this.getRows();
        this.getItems();

        this.loading = false;
      },
      () => {
        this.toastService.showError(
          'An error occurred while removing managers'
        );
        this.loading = false;
      }
    );
  }

  removeEmployees(employees: TableRows[]) {
    this.loading = true;

    const employeesIds = employees.map((e) => e.id || '');

    this.departmentService
      .removeEmployees(this.id || '', employeesIds)
      .subscribe(
        () => {
          this.toastService.showSuccess('Employees removed successfully');
          this.employees = this.employees.filter(
            (e) => !employeesIds.includes(e)
          );

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while removing employees'
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
