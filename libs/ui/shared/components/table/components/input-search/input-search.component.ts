import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
  selector: 'expensesreport-input-search',
  standalone: true,
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
  imports: [CommonModule],
  providers: [],
})
export class InputSearchComponent {
  @Input() table!: Table;

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (this.table && value) this.table.filterGlobal(value, 'contains');
    else if (this.table) this.table.filterGlobal('', 'contains');
  }
}
