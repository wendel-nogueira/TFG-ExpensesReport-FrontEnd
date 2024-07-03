import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';
import { ExpenseAccountService, ToastService } from '@expensesreport/services';
import {
  ExpenseAccountStatus,
  ExpenseAccountType,
} from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-expense-accounts-list-page',
  standalone: true,
  templateUrl: './expense-accounts-list-page.component.html',
  styleUrl: './expense-accounts-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class ExpenseAccountsListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  expenseAccounts: TableRows[] = [];
  totalRecords = 0;
  loading = false;

  dataClicked: TableRows | null = null;

  constructor(
    private expenseAccountService: ExpenseAccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.expenseAccountService.getAll().subscribe(
      (expenseAccounts) => {
        console.log(expenseAccounts);
        this.expenseAccounts = expenseAccounts.map((ea) => {
          return {
            id: ea.id || '',
            code: ea.code || '',
            name: ea.name || '',
            category: ea.category?.name || '',
            description: ea.description || '',
            status:
              ea.status !== undefined ? ExpenseAccountStatus[ea.status] : '',
            type: ea.type !== undefined ? ExpenseAccountType[ea.type] : '',
          };
        });

        this.totalRecords = this.expenseAccounts.length;
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onclickMore(
    event: { event: PointerEvent; data: TableRows },
    op: OverlayPanel
  ) {
    this.dataClicked = event.data;

    op.toggle(event.event);
  }
}

const columns: TableColumn[] = [
  { field: 'code', header: 'code' },
  { field: 'name', header: 'name', sortable: true },
  { field: 'category', header: 'category', sortable: true },
  { field: 'description', header: 'description' },
  {
    field: 'type',
    header: 'type',
    filter: true,
    filterValues: ['asset', 'expense'],
    sortable: true,
  },
  {
    field: 'status',
    header: 'status',
    filter: true,
    filterValues: ['active', 'inactive', 'deleted', 'replaced'],
    sortable: true,
  },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  status: string;
  type: string;
}
