import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'expensesreport-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  imports: [CommonModule],
})
export class FilterComponent {
  @Input() table!: Table;
  @Input() columns: any[] = [];

  filterableColumns: TableColumn[] = [];

  ngOnInit(): void {
    this.columns.forEach((column) => {
      if (
        column.filter &&
        this.table &&
        this.filterableColumns.findIndex((c) => c.column === column.field) ===
          -1
      ) {
        this.filterableColumns.push({
          column: column.field,
          header: column.header,
          values: column.filterValues,
          activeFilter: null,
        });
        console.log('filterableColumns', this.filterableColumns);
      }
    });
  }

  onFilter(filterableColumn: TableColumn, value: string) {
    this.filterableColumns.forEach((c) => {
      if (c.column !== filterableColumn.column) {
        c.activeFilter = null;
      }
    });

    filterableColumn.activeFilter =
      filterableColumn.activeFilter === value ? null : value;

    this.table.filter(
      filterableColumn.activeFilter,
      filterableColumn.column,
      'equals'
    );
  }

  clearFilter() {
    this.filterableColumns.forEach((c) => {
      c.activeFilter = null;
    });

    this.table.reset();
  }
}

export interface TableColumn {
  column: string;
  header: string;
  values: string[];
  activeFilter?: string | null;
}
