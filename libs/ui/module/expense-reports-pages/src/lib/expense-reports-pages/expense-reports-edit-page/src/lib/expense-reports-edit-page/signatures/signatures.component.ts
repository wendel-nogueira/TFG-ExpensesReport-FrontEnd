import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewComponent } from '@expensesreport/icons';
import { ExpenseReport, Signature } from '@expensesreport/models';
import {
  AuthService,
  DialogService,
  ExpenseReportService,
  NetworkService,
  ToastService,
} from '@expensesreport/services';
import { TableColumn, TableComponent } from '@expensesreport/ui';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'expensesreport-signatures',
  standalone: true,
  templateUrl: './signatures.component.html',
  styleUrl: './signatures.component.css',
  imports: [CommonModule, TableComponent, OverlayPanelModule, ViewComponent],
})
export class SignaturesComponent implements OnChanges, OnInit {
  @Input() expenseReport: ExpenseReport | null = null;
  @Input() signatures: Signature[] = [];

  loading = false;
  columns: TableColumn[] = columns;
  rows: TableRows[] = [];
  totalRecords = 0;

  ipAddress = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private expenseReportService: ExpenseReportService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private networkService: NetworkService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.networkService.getIPAddress().subscribe((ipAddress) => {
      this.ipAddress = ipAddress.ip;
      this.loading = false;
    });
  }

  ngOnChanges(): void {
    this.rows = this.signatures.map((signature) => ({
      id: signature.id || '',
      user:
        signature.user !== null && signature.user !== undefined
          ? signature.user.identity?.email || ''
          : signature.userId || '',
      name: signature.user !== null && signature.user !== undefined
      ? `${signature.user.firstName} ${signature.user.lastName}`
      : signature.name || '',
      acceptance: signature.acceptance ? 'Yes' : 'No',
      date: signature.signatureDate as Date,
      ipAddress: signature.ipAddress,
    }));

    this.rows = this.rows.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });

    this.totalRecords = this.rows.length;
  }

  onClickAdd(): void {
    if (!this.expenseReport) {
      return;
    }

    const signature: Signature = {
      acceptance: true,
      ipAddress: this.ipAddress,
    };

    this.dialogService.confirm(
      'Add Signature',
      'Are you sure you want to sign this expense report?',
      () => {
        this.Sign(signature);
      },
      () => undefined
    );
  }

  Sign(signature: Signature) {
    if (!this.expenseReport) {
      return;
    }

    const id = this.expenseReport.id as string;

    this.expenseReportService.sign(id, signature).subscribe(
      () => {
        this.toastService.showSuccess('Expense report signed successfully');
        this.router.navigate(['/expense-reports']);
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
  }
}

const columns: TableColumn[] = [
  { field: 'user', header: 'User' },
  { field: 'name', header: 'Name' },
  { field: 'acceptance', header: 'Acceptance' },
  { field: 'date', header: 'Signature Date' },
  { field: 'ipAddress', header: 'IP Address' },
];

interface TableRows {
  id: string;
  user: string;
  name: string;
  acceptance: string;
  date: Date;
  ipAddress: string;
}
