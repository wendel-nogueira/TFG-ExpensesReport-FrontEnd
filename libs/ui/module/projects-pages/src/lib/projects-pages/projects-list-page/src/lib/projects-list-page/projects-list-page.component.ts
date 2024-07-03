import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';
import {
  DepartmentService,
  ProjectService,
  ToastService,
} from '@expensesreport/services';
import { ProjectStatus, UserRoles } from '@expensesreport/enums';
import { Project, User } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-projects-list-page',
  standalone: true,
  templateUrl: './projects-list-page.component.html',
  styleUrl: './projects-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class ProjectsListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  projects: TableRows[] = [];
  totalRecords = 0;
  loading = false;

  dataClicked: TableRows | null = null;

  constructor(
    private projectService: ProjectService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const user = localStorage.getItem('user') || '{}';
    const userInfo = (JSON.parse(user) as User) || {};

    console.log(userInfo);

    this.projectService.getAll().subscribe(
      (projects) => {
        console.log(projects);
        const allProjects: Project[] = [];

        for (let i = 0; i < projects.length; i++) {
          const projectDeps = projects[i].departments || [];

          for (let j = 0; j < projectDeps.length; j++) {
            this.departmentService.get(projectDeps[j]).subscribe(
              (department) => {
                const isRelated =
                  department.managers!.includes(userInfo.id!) ||
                  department.employees!.includes(userInfo.id!);

                if (isRelated) {
                  allProjects.push(projects[i]);
                }

                if (i === projects.length - 1 && j === projectDeps.length - 1) {
                  this.projects = allProjects.map((project) => {
                    return {
                      id: project.id!,
                      code: project.code!,
                      name: project.name!,
                      description: project.description!,
                      status: ProjectStatus[project.status!],
                    };
                  });
                  this.totalRecords = this.projects.length;
                  this.loading = false;
                }
              },
              (error) => {
                console.error(error);
              }
            );
          }

          if (i === projects.length - 1 && projectDeps.length === 0) {
            this.projects = allProjects.map((project) => {
              return {
                id: project.id!,
                code: project.code!,
                name: project.name!,
                description: project.description!,
                status: ProjectStatus[project.status!],
              };
            });
            this.totalRecords = this.projects.length;
            this.loading = false;
          }
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
  { field: 'code', header: 'code', sortable: true },
  { field: 'name', header: 'name', sortable: true },
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
  code: string;
  description: string;
  status: string;
}
