import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from '../../index';
import { MoreComponent } from '../icons/index';
import { Table, TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { FormControl } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { InputSearchComponent } from './components/input-search/input-search.component';
import { FilterComponent } from './components/filter/filter.component';
import { SortComponent } from './components/sort/sort.component';
import { PdfService, ToastService } from '../../../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'expensesreport-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports: [
    CommonModule,
    TableModule,
    SkeletonModule,
    TagComponent,
    MoreComponent,
    ButtonComponent,
    InputSearchComponent,
    FilterComponent,
    SortComponent,
  ],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() numberOfRows: number = 10;
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = true;
  @Input() showAddButton: boolean = false;
  @Input() showExportButton: boolean = true;
  @Input() showFilterButton: boolean = true;
  @Input() showSortButton: boolean = true;
  @Input() showSearchInput: boolean = true;
  @Input() showCheckbox: boolean = false;
  @Output() onClick = new EventEmitter<{
    event: any;
    data: any;
  }>();
  @Output() onClickAdd = new EventEmitter<void>();
  @Output() onClickRemove = new EventEmitter<any>();

  @ViewChild(Table)
  table!: Table;

  searchFormControl = new FormControl('');

  defaultSize = 0;
  sizeOfDate = 15;
  sizeOfRoles = 15;
  sizeOfTags = 6;
  sizeOfActions = 1;
  sizeOfQuantity = 10;
  sizeOfTotal = 10;
  containsMore = false;

  showFilter = false;
  showSort = false;

  currentPage = 0;
  numberOfPages = 0;
  rowsToComplete = 0;

  selectedItems: any[] = [];
  columnsToComplete = 0;

  loadingExport = false;

  constructor(
    private pdfService: PdfService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.calculateSizeOfColumns();

    this.containsMore = this.columns.some(
      (column) => column.field === 'more' || column.field === 'actions'
    );
  }

  ngOnChanges(changes: any) {
    this.columnsToComplete = this.columns.filter(
      (column) => column.field !== 'actions' && column.field !== 'more'
    ).length;

    if (
      changes.data &&
      changes.data.currentValue &&
      changes.data.currentValue.length > 0
    ) {
      this.numberOfPages = Math.ceil(this.totalRecords / this.numberOfRows);
      this.currentPage = 0;
      this.totalRecords = changes.data.currentValue.length;

      this.calculateRowsToComplete();
    }
  }

  onPage(event: any) {
    this.numberOfPages = Math.ceil(this.totalRecords / this.numberOfRows);
    this.currentPage = event.first / this.numberOfRows;

    this.calculateRowsToComplete();
  }

  openFilter() {
    this.showSort = false;
    this.showFilter = !this.showFilter;
  }

  openSort() {
    this.showFilter = false;
    this.showSort = !this.showSort;
  }

  onClickMore(event: any, data: any) {
    this.onClick.emit({ event, data });
  }

  calculateSizeOfColumns() {
    const numberOfColumns = this.columns.filter(
      (column) =>
        column.field !== 'actions' &&
        column.field !== 'more' &&
        column.field !== 'isActive' &&
        column.field !== 'isDeleted' &&
        column.field !== 'status' &&
        column.field !== 'date'
    ).length;

    let otherColumnsSize = 0;

    if (this.columns.some((column) => column.field === 'date'))
      otherColumnsSize += this.sizeOfDate;

    if (
      this.columns.some(
        (column) =>
          column.field === 'isActive' ||
          column.field === 'isDeleted' ||
          column.field === 'status'
      )
    )
      otherColumnsSize += this.sizeOfTags;

    if (
      this.columns.some(
        (column) => column.field === 'actions' || column.field === 'more'
      )
    )
      otherColumnsSize += this.sizeOfActions;

    this.defaultSize = (100 - otherColumnsSize) / numberOfColumns;
  }

  calculateRowsToComplete() {
    if (this.currentPage === this.numberOfPages - 1) {
      this.rowsToComplete =
        this.numberOfRows - (this.totalRecords % this.numberOfRows);
    } else {
      this.rowsToComplete = this.numberOfRows;
    }
  }

  onAddClick() {
    this.onClickAdd.emit();
  }

  onRemoveClick() {
    this.onClickRemove.emit(this.selectedItems);
  }

  export() {
    this.loadingExport = true;

    const route = this.router.url.split('/') || [];

    let title = '';
    const routeMappings = {
      users: 'users',
      projects: 'projects',
      departments: 'departments',
      'expense-accounts': 'accounts',
      'expense-reports': 'reports',
      expenses: 'expenses',
      categories: 'categories',
      seasons: 'seasons',
    };

    for (const routeKey in routeMappings) {
      if (route.includes(routeKey)) {
        title = routeMappings[routeKey as keyof typeof routeMappings];
        break;
      }
    }

    this.pdfService
      .generateListPDF(title, this.columns, this.data)
      .then(() => {
        this.loadingExport = false;

        this.toastService.showSuccess('Exported successfully');
      })
      .catch(() => {
        this.loadingExport = false;

        this.toastService.showError('Error exporting');
      });
  }
}

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterValues?: string[];
}
