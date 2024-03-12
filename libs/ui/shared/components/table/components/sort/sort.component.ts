import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import {
  SortComponent as SortIconComponent,
  SortAscComponent,
  SortDescComponent,
} from '../../../icons/index';

@Component({
  selector: 'expensesreport-sort',
  standalone: true,
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.css',
  imports: [
    CommonModule,
    SortIconComponent,
    SortAscComponent,
    SortDescComponent,
  ],
})
export class SortComponent implements OnInit {
  @Input() table!: Table;
  @Input() columns: any[] = [];

  sortableColumns: TableColumn[] = [];

  ngOnInit(): void {
    this.columns.forEach((column) => {
      if (
        column.sortable &&
        this.table &&
        this.sortableColumns.findIndex((c) => c.column === column.field) === -1
      ) {
        this.sortableColumns.push({
          column: column.field,
          header: column.header,
          sort: null,
        });
      }
    });
  }

  onSort(column: TableColumn): void {
    this.sortableColumns.forEach((c) => {
      if (c.column !== column.column) {
        c.sort = null;
      }
    });

    if (column.sort === null) {
      column.sort = 1;
    } else if (column.sort === 1) {
      column.sort = -1;
    } else {
      column.sort = null;
    }

    if (column.sort !== null) {
      this.table.sort({
        field: column.column,
        order: column.sort === 1 ? 1 : -1,
      });
    } else {
      this.table.sort({
        field: 'id',
        order: 1,
      });
    }
  }

  clearSort(): void {
    if (this.sortableColumns.some((c) => c.sort !== null)) {
      this.sortableColumns.forEach((c) => {
        c.sort = null;
      });
      this.table.sort({
        field: 'id',
        order: 0,
      });
    }
  }
}

export interface TableColumn {
  column: string;
  header: string;
  sort: number | null;
}
