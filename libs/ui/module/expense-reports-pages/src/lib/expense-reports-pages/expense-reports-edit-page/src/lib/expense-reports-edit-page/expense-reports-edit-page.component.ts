import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  ExpenseReportService,
  PdfService,
  ToastService,
} from '@expensesreport/services';
import { Router } from '@angular/router';
import { ExpenseReport, Signature } from '@expensesreport/models';
import { MenuItem } from 'primeng/api';
import { TabMenuComponent } from '@expensesreport/ui';
import { InformationComponent } from './information/information.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SignaturesComponent } from './signatures/signatures.component';
import { ExpenseService } from './services/expense.service';
import { UserRoles, roleToName } from '@expensesreport/enums';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'expensesreport-expense-reports-edit-page',
  standalone: true,
  templateUrl: './expense-reports-edit-page.component.html',
  styleUrl: './expense-reports-edit-page.component.css',
  imports: [
    CommonModule,
    TabMenuComponent,
    InformationComponent,
    ExpensesComponent,
    SignaturesComponent,
    SkeletonModule,
  ],
})
export class ExpenseReportsEditPageComponent implements OnInit {
  id: string | null = null;
  userId: string | null = null;
  expenseReport: ExpenseReport | null = null;
  signatures: Signature[] = [];

  loading = false;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor(
    private router: Router,
    private expenseReportService: ExpenseReportService,
    private toastService: ToastService,
    private authService: AuthService,
    public expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.id = this.router.url.split('/').pop() || null;

    if (!this.id || this.id === null) {
      this.toastService.showError('Season not found');
      this.router.navigate(['/seasons']);
      return;
    }

    const data = this.authService.getSessionData();

    if (!data) {
      this.router.navigate(['/']);
      return;
    }

    this.userId = data.nameid;

    const isAccountant = data.role === roleToName(UserRoles.Accountant);

    this.items = [
      { label: 'information', icon: 'pi pi-fw pi-info' },
      { label: 'expenses', icon: 'pi pi-fw pi-money-bill' },
      { label: 'signatures', icon: 'pi pi-fw pi-pencil' },
    ];
    this.activeItem = this.items[0];

    this.loading = true;

    this.expenseReportService
      .getById(this.id as string)
      .subscribe((expenseReport) => {
        const isSupervisor = expenseReport.user?.supervisors?.some(
          (supervisor) => supervisor.identityId === this.userId
        );

        if (
          this.userId !== expenseReport.user?.identityId &&
          !isSupervisor &&
          !isAccountant
        ) {
          this.router.navigate(['/']);
        }

        console.log(expenseReport);

        this.expenseReport = expenseReport;
        this.expenseService.clear();
        this.expenseService.register.expenses = expenseReport.expenses || [];
        this.loading = false;

        this.expenseReport.signatures?.forEach((signature) => {
          this.signatures.push(signature);
        });

        console.log(this.signatures);
      });
  }

  activeItemChange(item: MenuItem) {
    this.activeItem = item;
  }

  onBack() {
    this.router.navigate(['/expense-reports']);
  }
}
