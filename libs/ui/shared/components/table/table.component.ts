import {
  Component,
  EventEmitter,
  Input,
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
export class TableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() numberOfRows: number = 10;
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Output() onClick = new EventEmitter<{
    event: any;
    data: any;
  }>();

  @ViewChild(Table)
  table!: Table;

  searchFormControl = new FormControl('');

  defaultSize = 0;
  sizeOfDate = 15;
  sizeOfTags = 8;
  sizeOfActions = 1;
  containsMore = false;

  showFilter = false;
  showSort = false;

  ngOnInit() {
    this.calculateSizeOfColumns();

    this.containsMore = this.columns.some(
      (column) => column.field === 'more' || column.field === 'actions'
    );
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
}

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterValues?: string[];
}
