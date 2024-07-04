import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TabMenuComponent,
  TableColumn,
  TablePageComponent,
  SelectItem,
} from '@expensesreport/ui';
import { Router } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { Department, Project, Season } from '@expensesreport/models';
import { MenuItem } from 'primeng/api';
import {
  DepartmentService,
  ProjectService,
  SeasonService,
  ToastService,
} from '@expensesreport/services';
import { DepartmentStatus, UserRoles } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-projects-edit-page',
  standalone: true,
  templateUrl: './projects-edit-page.component.html',
  styleUrl: './projects-edit-page.component.css',
  imports: [CommonModule, TabMenuComponent, EditComponent, TablePageComponent],
})
export class ProjectsEditPageComponent implements OnInit {
  id: string | null = null;
  project: Project | null = null;
  seasons: Season[] = [];
  departments: string[] = [];
  allSeasons: Season[] = [];
  allDepartments: Department[] = [];

  seasonsColumns: TableColumn[] = columnsSeasons;
  departmentsColumns: TableColumn[] = columnsDepartments;
  seasonsRows: SeasonsTableRows[] = [];
  departmentsRows: DepartmentsTableRows[] = [];
  totalSeasonsRecords = 0;
  totalDepartmentsRecords = 0;

  seasonsItems: SelectItem[] = [];
  departmentsItems: SelectItem[] = [];

  loading = false;
  disabled = false;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private seasonService: SeasonService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.router.url.split('/').pop() || null;

    if (!this.id || this.id === null) {
      this.toastService.showError('Project not found');
      this.router.navigate(['/projects']);
      return;
    }

    this.loading = true;

    this.items = [
      { label: 'edit', icon: 'pi pi-pencil' },
      { label: 'seasons', icon: 'pi pi-calendar' },
      { label: 'departments', icon: 'pi pi-briefcase' },
    ];
    this.activeItem = this.items[0];

    this.departmentService.getAll().subscribe(
      (departments) => {
        this.allDepartments = departments;

        this.seasonService.getAll().subscribe(
          (seasons) => {
            this.allSeasons = seasons;

            if (this.id === null) {
              this.toastService.showError('Project not found');
              this.router.navigate(['/projects']);
              return;
            }

            this.projectService.get(this.id).subscribe(
              (project) => {
                this.project = project;

                this.seasons = project.seasons || [];
                this.departments = project.departments || [];

                console.log(this.project);

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
            throw new Error(error);
          }
        );
      },
      (error) => {
        this.toastService.showError(error);
        this.router.navigate(['/projects']);
      }
    );
  }

  getRows() {
    this.seasonsRows = [];
    this.departmentsRows = [];

    this.seasons.forEach((season) => {
      this.seasonsRows.push({
        id: season.id || '',
        code: season.code,
        name: season.name,
      });
    });

    console.log(this.departments);
    console.log(this.allDepartments);

    this.departments.forEach((department) => {
      const d = this.allDepartments.find((d) => d.id === department);
      if (!d) return;

      this.departmentsRows.push({
        id: d.id || '',
        acronym: d.acronym,
        name: d.name,
        status: d.status !== undefined ? DepartmentStatus[d.status] : '',
      });
    });

    this.totalSeasonsRecords = this.seasonsRows.length;
    this.totalDepartmentsRecords = this.departmentsRows.length;
  }

  getItems() {
    this.seasonsItems = [];
    this.departmentsItems = [];

    this.allSeasons.forEach((season) => {
      if (this.seasons.find((s) => s.id === season.id)) return;
      this.seasonsItems.push({
        label: `${season.code} - ${season.name}`,
        value: season.id || '',
      });
    });

    this.getDepartmentsItems();

    // this.allDepartments.forEach((department) => {
    //   if (this.departments.find((d) => d === department.id)) return;
    //   this.departmentsItems.push({
    //     label: `${department.acronym} - ${department.name}`,
    //     value: department.id || '',
    //   });
    // });
  }

  activeItemChange(item: MenuItem) {
    this.activeItem = item;
  }

  addSeasons(seasons: SelectItem[]) {
    this.loading = true;

    this.projectService
      .addSeasons(
        this.id || '',
        seasons.map((s) => s.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Seasons added successfully');

          this.seasons = this.seasons.concat(
            this.allSeasons.filter((as) =>
              seasons.find((s) => s.value === as.id)
            )
          );

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError('An error occurred while adding seasons');
          this.loading = false;
        }
      );
  }

  addDepartments(departments: SelectItem[]) {
    this.loading = true;

    this.projectService
      .addDepartments(
        this.id || '',
        departments.map((d) => d.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Departments added successfully');

          this.departments = this.departments.concat(
            departments.map((d) => d.value)
          );

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while adding departments'
          );
          this.loading = false;
        }
      );
  }

  removeSeasons(seasons: SeasonsTableRows[]) {
    this.loading = true;

    const seasonsIds = seasons.map((s) => s.id || '');

    this.projectService.removeSeasons(this.id || '', seasonsIds).subscribe(
      () => {
        this.toastService.showSuccess('Seasons removed successfully');

        this.seasons = this.seasons.filter(
          (s) => !seasonsIds.includes(s.id || '')
        );

        this.getRows();
        this.getItems();

        this.loading = false;
      },
      () => {
        this.toastService.showError('An error occurred while removing seasons');
        this.loading = false;
      }
    );
  }

  removeDepartments(departments: DepartmentsTableRows[]) {
    this.loading = true;

    const departmentIds = departments.map((d) => d.id || '');

    this.projectService
      .removeDepartments(this.id || '', departmentIds)
      .subscribe(
        () => {
          this.toastService.showSuccess('Departments removed successfully');

          this.departments = this.departments.filter(
            (d) => !departmentIds.includes(d)
          );

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while removing departments'
          );
          this.loading = false;
        }
      );
  }

  getDepartmentsItems() {
    this.loading = true;

    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const isRoot =
      userInfo.identity?.role === UserRoles.Accountant ||
      userInfo.identity?.role === UserRoles.Admin;

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
                this.departmentsItems = [];

                const tempDepartments: SelectItem[] = [];

                for (let j = 0; j < allDepartments.length; j++) {
                  console.log(allDepartments[j].managers, userInfo.id);
                  console.log(allDepartments[j].employees, userInfo.id);

                  if (
                    userInfo.identity?.role === UserRoles.Accountant ||
                    userInfo.identity?.role === UserRoles.Admin
                  ) {
                    tempDepartments.push({
                      label: allDepartments[j].name,
                      value: allDepartments[j].id || '',
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
                      label: allDepartments[j].name,
                      value: allDepartments[j].id || '',
                    });
                  }
                }

                console.log(tempDepartments);
                this.departmentsItems = tempDepartments.filter(
                  (d) => !this.departments.find((dd) => dd === d.value)
                );
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

const columnsSeasons: TableColumn[] = [
  { field: 'code', header: 'code', sortable: true },
  { field: 'name', header: 'name', sortable: true },
  { field: 'actions', header: 'actions' },
];

const columnsDepartments: TableColumn[] = [
  { field: 'acronym', header: 'acronym', sortable: true },
  { field: 'name', header: 'name', sortable: true },
  {
    field: 'status',
    header: 'status',
    sortable: true,
    filter: true,
    filterValues: ['Active', 'Inactive', 'Deleted'],
  },
  { field: 'actions', header: 'actions' },
];

interface SeasonsTableRows {
  id: string;
  code: string;
  name: string;
}

interface DepartmentsTableRows {
  id: string;
  acronym: string;
  name: string;
  status: string;
}
