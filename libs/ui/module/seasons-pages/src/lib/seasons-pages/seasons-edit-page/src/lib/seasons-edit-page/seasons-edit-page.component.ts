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
  ProjectService,
  SeasonService,
  ToastService,
} from '@expensesreport/services';
import { ProjectStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-seasons-edit-page',
  standalone: true,
  templateUrl: './seasons-edit-page.component.html',
  styleUrl: './seasons-edit-page.component.css',
  imports: [CommonModule, TabMenuComponent, EditComponent, TablePageComponent],
})
export class SeasonsEditPageComponent {
  id: string | null = null;
  season: Season | null = null;
  projects: Project[] = [];
  allProjects: Project[] = [];

  columns: TableColumn[] = columns;
  rows: TableRows[] = [];
  totalRecords = 0;

  allItems: SelectItem[] = [];

  loading = false;
  disabled = false;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private seasonService: SeasonService,
    private toastService: ToastService
  ) {
    this.id = this.router.url.split('/').pop() || null;

    if (!this.id || this.id === null) {
      this.toastService.showError('Season not found');
      this.router.navigate(['/seasons']);
      return;
    }

    this.loading = true;

    this.items = [
      { label: 'edit', icon: 'pi pi-pencil' },
      { label: 'projects', icon: 'pi pi-list' },
    ];
    this.activeItem = this.items[0];

    this.projectService.getAll().subscribe(
      (projects) => {
        this.allProjects = projects;

        this.seasonService.get(this.id as string).subscribe((season) => {
          this.season = season;
          this.projects = season.projects || [];

          this.getRows();
          this.getItems();

          this.loading = false;
        });
      },
      () => {
        this.toastService.showError('Error fetching projects');
        this.router.navigate(['/seasons']);
      }
    );
  }

  getRows() {
    this.rows = [];

    this.projects.forEach((project) => {
      this.rows.push({
        id: project.id as string,
        name: project.name,
        code: project.code,
        description: project.description,
        status: ProjectStatus[project.status],
      });
    });

    this.totalRecords = this.rows.length;
  }

  getItems() {
    this.allItems = [];

    this.allProjects.forEach((project) => {
      this.allItems.push({
        label: `${project.code} - ${project.name}`,
        value: project.id as string,
      });
    });
  }

  activeItemChange(item: MenuItem) {
    this.activeItem = item;
  }

  addProjects(projects: SelectItem[]) {
    this.loading = true;

    this.seasonService
      .addProjects(
        this.id as string,
        projects.map((p) => p.value)
      )
      .subscribe(
        () => {
          this.toastService.showSuccess('Projects added successfully');

          this.projects = this.projects.concat(
            this.allProjects.filter((ap) =>
              projects.find((p) => p.value === ap.id)
            )
          );

          if (this.season) this.season.projects = this.projects;

          this.getRows();
          this.getItems();

          this.loading = false;
        },
        () => {
          this.toastService.showError(
            'An error occurred while adding projects'
          );
          this.loading = false;
        }
      );
  }

  removeProjects(projects: TableRows[]) {
    this.loading = true;

    const projectsIds = projects.map((p) => p.id || '');

    this.seasonService.removeProjects(this.id as string, projectsIds).subscribe(
      () => {
        this.toastService.showSuccess('Projects removed successfully');

        this.projects = this.projects.filter(
          (p) => !projectsIds.includes(p.id || '')
        );

        if (this.season) this.season.projects = this.projects;

        this.getRows();
        this.getItems();

        this.loading = false;
      },
      () => {
        this.toastService.showError(
          'An error occurred while removing projects'
        );
        this.loading = false;
      }
    );
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
