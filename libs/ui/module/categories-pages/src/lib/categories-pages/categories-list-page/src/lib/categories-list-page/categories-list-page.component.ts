import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';
import {
  ExpenseAccountCategoryService,
  ToastService,
} from '@expensesreport/services';
import { CategoryStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-categories-list-page',
  standalone: true,
  templateUrl: './categories-list-page.component.html',
  styleUrl: './categories-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class CategoriesListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  categories: TableRows[] = [];
  totalRecords = 0;
  loading = false;

  dataClicked: TableRows | null = null;

  constructor(
    private categoryService: ExpenseAccountCategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.categoryService.getAll().subscribe(
      (categories) => {
        this.categories = categories.map((category) => ({
          id: category.id || '',
          name: category.name,
          description: category.description,
          status:
            category.status !== undefined
              ? CategoryStatus[category.status]
              : '',
        }));

        this.totalRecords = this.categories.length;
        this.loading = false;
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
  description: string;
  status: string;
}
