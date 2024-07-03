import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';
import { DepartmentService, ToastService } from '@expensesreport/services';
import { DepartmentStatus, UserRoles } from '@expensesreport/enums';
import { Department, User } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-departments-list-page',
  standalone: true,
  templateUrl: './departments-list-page.component.html',
  styleUrl: './departments-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class DepartmentsListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  departments: TableRows[] = [];
  totalRecords = 0;
  loading = true;

  dataClicked: TableRows | null = null;

  showOverlayPanel = false;

  constructor(
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // this.loading = true;

    const user = localStorage.getItem('user') || '{}';
    const userInfo = (JSON.parse(user) as User) || {};

    const isRoot =
      userInfo.identity?.role === UserRoles.Accountant ||
      userInfo.identity?.role === UserRoles.Admin;

    console.log(userInfo);

    if (
      userInfo.identity?.role === UserRoles.Accountant ||
      userInfo.identity?.role === UserRoles.Admin
    ) {
      this.showOverlayPanel = true;
    }

    this.departmentService.getAll().subscribe(
      (departments) => {
        const allDepartments: Department[] = [];

        for (let i = 0; i < departments.length; i++) {
          if (
            !departments[i].id ||
            (!isRoot &&
              (departments[i].status === DepartmentStatus.Deleted ||
                departments[i].status === DepartmentStatus.Inactive))
          ) {
            continue;
          }

          this.departmentService.get(departments[i].id!).subscribe(
            (department) => {
              allDepartments.push(department);

              if (departments.length === allDepartments.length) {
                this.departments = [];
                const tempDepartments: TableRows[] = [];

                for (let j = 0; j < allDepartments.length; j++) {
                  console.log(allDepartments[j]);

                  if (
                    userInfo.identity?.role === UserRoles.Accountant ||
                    userInfo.identity?.role === UserRoles.Admin
                  ) {
                    tempDepartments.push({
                      id: allDepartments[j].id || '',
                      name: allDepartments[j].name,
                      acronym: allDepartments[j].acronym,
                      projectsQuantity: 0,
                      totalExpense: 0,
                      description: allDepartments[j].description,
                      status:
                        allDepartments[j].status !== undefined
                          ? DepartmentStatus[allDepartments[j].status ?? 0]
                          : '',
                    });
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
                    tempDepartments.push({
                      id: allDepartments[j].id || '',
                      name: allDepartments[j].name,
                      acronym: allDepartments[j].acronym,
                      projectsQuantity: 0,
                      totalExpense: 0,
                      description: allDepartments[j].description,
                      status:
                        allDepartments[j].status !== undefined
                          ? DepartmentStatus[allDepartments[j].status ?? 0]
                          : '',
                    });
                  }
                }

                this.departments = tempDepartments;
                this.totalRecords = this.departments.length;
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

  onClickMore(
    event: { event: PointerEvent; data: TableRows },
    op: OverlayPanel
  ) {
    this.dataClicked = event.data;
    op.toggle(event.event);
  }
}

const columns: TableColumn[] = [
  { field: 'acronym', header: 'acronym', sortable: true },
  { field: 'name', header: 'name', sortable: true },
  // { field: 'projectsQuantity', header: 'projects' },
  // { field: 'totalExpense', header: 'total expense' },
  { field: 'description', header: 'description' },
  {
    field: 'status',
    header: 'status',
    sortable: true,
    filter: true,
    filterValues: ['Active', 'Inactive', 'Deleted'],
  },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  name: string;
  acronym: string;
  projectsQuantity: number;
  totalExpense: number;
  description: string;
  status: string;
}
