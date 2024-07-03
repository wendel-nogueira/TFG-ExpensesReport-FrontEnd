import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewComponent } from '@expensesreport/icons';
import { TableColumn, TableComponent } from '@expensesreport/ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ExpenseService } from '../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'expensesreport-expenses',
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
  imports: [CommonModule, TableComponent, OverlayPanelModule, ViewComponent],
})
export class ExpensesComponent {
  columns: TableColumn[] = columns;
  rows: TableRows[] = [];
  totalRecords = 0;
  dataClicked: TableRows | undefined;

  loading = false;

  constructor(public expenseService: ExpenseService, private router: Router) {
    this.rows = this.expenseService.getRegister().expenses.map((e) => ({
      id: e.id as string,
      expenseAccount: e.expenseAccountId!,
      expenseAccountName: e.expenseAccountName ?? 'Unknown',
      amount: e.amount,
      dateIncurred: e.dateIncurred,
      dateIncurredDate: new Date(e.dateIncurred).toLocaleDateString('en-US'),
      dateIncurredTimeZone: e.dateIncurredTimeZone,
      explanation: e.explanation,
      receipt: e.receipt,
    }));

    this.totalRecords = this.rows.length;
  }

  onClickMore(
    event: { event: PointerEvent; data: TableRows },
    op: OverlayPanel
  ) {
    this.dataClicked = event.data;
    op.toggle(event.event);
  }

  onClickAdd() {
    this.router.navigate(['expense-reports/create/expense']);
  }

  onClickEdit() {
    this.router.navigate(['expense-reports/create/expense'], {
      queryParams: { id: this.dataClicked?.id },
    });
  }

  onRemove(event: TableRows[]) {
    this.rows = this.rows.filter((r) => !event.includes(r));
    this.totalRecords = this.rows.length;

    event.forEach((e) => {
      const index = this.expenseService
        .getRegister()
        .expenses.findIndex((ex) => ex.id === e.id);

      if (index !== -1) {
        this.expenseService.getRegister().expenses.splice(index, 1);
      }
    });
  }
}

const columns: TableColumn[] = [
  // { field: 'expenseAccount', header: 'account' },
  { field: 'expenseAccountName', header: 'account' },
  { field: 'amount', header: 'amount' },
  { field: 'dateIncurredDate', header: 'date' },
  { field: 'dateIncurredTimeZone', header: 'time zone' },
  { field: 'explanation', header: 'explanation' },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  expenseAccount: string;
  expenseAccountName: string;
  amount: number;
  dateIncurred: string;
  dateIncurredDate: string;
  dateIncurredTimeZone: string;
  explanation: string;
  receipt: string;
}
