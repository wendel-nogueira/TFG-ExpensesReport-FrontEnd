import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, SelectItem } from 'primeng/api';
import {
  ButtonComponent,
  FormGroupComponent,
  LabelComponent,
  PageContentComponent,
  SelectComponent,
  TabMenuComponent,
} from '@expensesreport/ui';
import { Department, ExpenseReport, User } from '@expensesreport/models';
import { ExpensesComponent } from './expenses/expenses.component';
import {
  AuthService,
  DepartmentService,
  ExpenseReportService,
  ProjectService,
  ToastService,
} from '@expensesreport/services';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from './services/expense.service';
import { DepartmentStatus, UserRoles } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-expense-reports-create-page',
  standalone: true,
  templateUrl: './expense-reports-create-page.component.html',
  styleUrl: './expense-reports-create-page.component.css',
  imports: [
    CommonModule,
    TabMenuComponent,
    ExpensesComponent,
    PageContentComponent,
    SelectComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ExpenseReportsCreatePageComponent implements OnInit {
  userId: string | undefined;
  loading = false;
  disabled = false;

  expenseReportFormGroup = new FormGroup({
    department: new FormControl('', [Validators.required]),
    project: new FormControl('', [Validators.required]),
  });
  departments: SelectItem[] = [];
  projects: SelectItem[] = [];

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  total = 0;

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private projectService: ProjectService,
    private expenseReportService: ExpenseReportService,
    private toastService: ToastService,
    private router: Router,
    public expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getSessionData()?.nameid;

    if (!userId) {
      this.toastService.showError('Error loading user');
      return;
    }

    this.userId = userId;

    this.items = [
      { label: 'information', icon: 'pi pi-fw pi-info' },
      { label: 'expenses', icon: 'pi pi-fw pi-money-bill' },
    ];
    this.activeItem = this.items[0];

    this.loading = true;

    this.getDepartments();
  }

  onDepartmentChange(event: { value: string }) {
    this.projects = [];
    this.expenseReportFormGroup.get('project')?.reset();

    this.expenseService.setDepartment(event.value);
    this.expenseService.setProject('');

    if (!event || !event.value) {
      return;
    }

    this.loading = true;

    this.projectService.getByDepartment(event.value).subscribe((projects) => {
      this.projects = projects.map((project) => ({
        label: `#${project.code}: ${project.name}`,
        value: project.id as string,
      }));
      this.loading = false;
    });
  }

  onProjectChange(event: { value: string }) {
    this.expenseService.setProject(event.value);
  }

  onSubmit() {
    if (this.expenseReportFormGroup.invalid) {
      Object.keys(this.expenseReportFormGroup.controls).forEach(
        (controlName) => {
          const control = this.expenseReportFormGroup.get(controlName);

          if (control) {
            control.markAsTouched();
            control.updateValueAndValidity();
          }
        }
      );

      return;
    }

    const expenses = this.expenseService.getRegister().expenses;

    if (expenses.length === 0) {
      this.toastService.showError('Add at least one expense');
      return;
    }

    const expenseReport: ExpenseReport = {
      userId: this.userId as string,
      departmentId: this.expenseReportFormGroup.get('department')
        ?.value as string,
      projectId: this.expenseReportFormGroup.get('project')?.value as string,
      expenses: expenses,
    };

    console.log(expenseReport);

    this.loading = true;

    this.expenseReportService.create(expenseReport).subscribe(
      () => {
        this.expenseService.clear();

        this.toastService.showSuccess('Expense report created');
        this.router.navigate(['/expense-reports']);
      },
      () => {
        this.toastService.showError('Error creating expense report');
        this.loading = false;
      }
    );
  }

  activeItemChange(item: MenuItem) {
    this.activeItem = item;
  }

  onBack() {
    this.router.navigate(['/expense-reports']);
  }

  getDepartments() {
    const user = localStorage.getItem('user') || '{}';
    const userInfo = (JSON.parse(user) as User) || {};

    this.departmentService.getAll().subscribe(
      (departments) => {
        const allDepartments: Department[] = [];
        const tempDepartments: Department[] = [];

        this.departments = [];
        this.loading = true;

        for (let i = 0; i < departments.length; i++) {
          if (
            !departments[i].id ||
            departments[i].status === DepartmentStatus.Deleted ||
            departments[i].status === DepartmentStatus.Inactive
          ) {
            continue;
          }

          this.departmentService.get(departments[i].id!).subscribe(
            (department) => {
              allDepartments.push(department);

              if (departments.length - 1 === i) {
                this.departments = [];

                for (let j = 0; j < allDepartments.length; j++) {
                  console.log(allDepartments[j]);
                  if (
                    userInfo.identity?.role === UserRoles.Accountant ||
                    userInfo.identity?.role === UserRoles.Admin
                  ) {
                    tempDepartments.push(allDepartments[j]);
                  } else if (
                    (allDepartments[j].managers?.find(
                      (m) => m === userInfo.id
                    ) ||
                      allDepartments[j].employees?.find(
                        (e) => e === userInfo.id
                      )) &&
                    allDepartments[j].status !== DepartmentStatus.Deleted &&
                    allDepartments[j].status !== DepartmentStatus.Inactive
                  ) {
                    tempDepartments.push(allDepartments[j]);
                  }
                }

                this.departments = tempDepartments.map((department) => ({
                  label: department.name,
                  value: department.id as string,
                }));

                this.loading = false;
              }
            },
            (error) => {
              throw new Error('Error getting department');
            }
          );
        }
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }
}
