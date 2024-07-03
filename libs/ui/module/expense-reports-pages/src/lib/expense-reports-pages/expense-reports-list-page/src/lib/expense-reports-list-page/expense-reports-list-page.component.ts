import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableColumn } from '@expensesreport/ui';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { ViewComponent } from '@expensesreport/icons';
import { RouterModule } from '@angular/router';
import { ExpenseReportService, ToastService } from '@expensesreport/services';
import {
  ExpenseReportStatus,
  UserRoles,
  expenseReportStatusToName,
} from '@expensesreport/enums';
import { User } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-expense-reports-list-page',
  standalone: true,
  templateUrl: './expense-reports-list-page.component.html',
  styleUrl: './expense-reports-list-page.component.css',
  imports: [
    CommonModule,
    OverlayPanelModule,
    RouterModule,
    TableComponent,
    ViewComponent,
  ],
})
export class ExpenseReportsListPageComponent implements OnInit {
  columns: TableColumn[] = columns;
  reports: TableRows[] = [];
  totalRecords = 0;
  loading = false;

  dataClicked: TableRows | null = null;

  constructor(
    private expenseReportService: ExpenseReportService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const user = localStorage.getItem('user') || '{}';
    const userInfo = (JSON.parse(user) as User) || {};

    const isAdmin = userInfo.identity?.role === UserRoles.Admin;
    const isAccountant = userInfo.identity?.role === UserRoles.Accountant;

    this.expenseReportService.getAll().subscribe(
      (reports) => {
        let allReports = reports;

        if (isAccountant) {
          allReports = allReports.filter(
            (report) =>
              report.status === ExpenseReportStatus.ApprovedBySupervisor ||
              report.status === ExpenseReportStatus.Paid ||
              report.status === ExpenseReportStatus.PartiallyPaid ||
              report.status === ExpenseReportStatus.PaymentRejected
          );
        } else if (!isAdmin) {
          const superviseds = userInfo.supervised?.map((s) => s.id) || [];

          console.log('superviseds', superviseds);

          allReports = allReports.filter(
            (report) =>
              report.userId === userInfo.id ||
              superviseds.includes(report.userId)
          );
        }

        this.reports = allReports.map((report) => ({
          id: report.id || '',
          user:
            report.user !== null && report.user !== undefined
              ? `${report.user.firstName} ${report.user.lastName}`
              : report.userId || '',
          department:
            report.department !== null && report.department !== undefined
              ? report.department.name
              : report.departmentId || '',
          project:
            report.project !== null && report.project !== undefined
              ? report.project.name
              : report.projectId || '',
          totalAmount: report.totalAmount || 0,
          amountApproved: report.amountApproved || 0,
          amountRejected: report.amountRejected || 0,
          status:
            report.status !== undefined
              ? expenseReportStatusToName(report.status)
              : '',
          actions: 'actions',
        }));
        this.totalRecords = this.reports.length;
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
  { field: 'user', header: 'user' },
  { field: 'department', header: 'department' },
  { field: 'project', header: 'project' },
  { field: 'totalAmount', header: 'total amount' },
  { field: 'amountApproved', header: 'amount approved' },
  { field: 'amountRejected', header: 'amount rejected' },
  {
    field: 'status',
    header: 'status',
    filter: true,
    filterValues: [
      'Created',
      'SubmittedForApproval',
      'ApprovedBySupervisor',
      'RejectedBySupervisor',
      'PartiallyPaid',
      'Paid',
      'PaymentRejected',
      'VoidCancelled',
    ],
    sortable: true,
  },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  user: string;
  department: string;
  project: string;
  totalAmount: number;
  amountApproved: number;
  amountRejected: number;
  status: string;
  actions: string;
}
