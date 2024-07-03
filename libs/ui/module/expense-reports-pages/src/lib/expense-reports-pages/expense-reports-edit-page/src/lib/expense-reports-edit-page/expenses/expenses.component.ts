import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ViewComponent } from '@expensesreport/icons';
import {
  TableColumn,
  TableComponent,
  ButtonComponent,
  TextAreaComponent,
  LabelComponent,
  FormGroupComponent,
} from '@expensesreport/ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ExpenseService } from '../services/expense.service';
import { Router } from '@angular/router';
import { ExpenseStatus, UserRoles, roleToName } from '@expensesreport/enums';
import { DialogModule } from 'primeng/dialog';
import {
  AuthService,
  DialogService,
  ExpenseService as ExpenseServices,
  ToastService,
} from '@expensesreport/services';
import { User } from '@expensesreport/models';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'expensesreport-expenses',
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
  imports: [
    CommonModule,
    TableComponent,
    OverlayPanelModule,
    ViewComponent,
    DialogModule,
    ButtonComponent,
    TextAreaComponent,
    LabelComponent,
    FormGroupComponent,
  ],
})
export class ExpensesComponent implements OnInit {
  columns: TableColumn[] = columns;
  rows: TableRows[] = [];
  totalRecords = 0;
  dataClicked: TableRows | undefined;

  loading = false;
  showModal = false;
  showModalReject = false;

  userId = '';
  showButtons = false;

  notes = new FormControl('', [Validators.maxLength(2000)]);
  notesErrors = {
    maxlength: 'Notes must be at most 2000 characters',
  };

  constructor(
    public expenseService: ExpenseService,
    private router: Router,
    private expenseServices: ExpenseServices,
    private authService: AuthService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {
    this.rows = this.expenseService.getRegister().expenses.map((e) => ({
      id: e.id as string,
      expenseAccount:
        e.expenseAccount !== undefined
          ? e.expenseAccount.name
          : e.expenseAccountId || '',
      amount: e.amount,
      date: e.dateIncurred,
      dateIncurredDate: new Date(e.dateIncurred).toLocaleDateString('en-US'),
      dateIncurredTimeZone: e.dateIncurredTimeZone,
      explanation: e.explanation,
      receipt: e.receipt,
      status: e.status !== undefined ? ExpenseStatus[e.status] : '',

      actionById: e.actionById,
      actionDate: e.actionDate,
      actionDateTimeZone: e.actionDateTimeZone,
      accountingNotes: e.accountingNotes,

      actionBy: e.actionBy,
    }));

    this.totalRecords = this.rows.length;
  }

  ngOnInit() {
    const data = this.authService.getSessionData();

    if (!data) {
      this.router.navigate(['/']);
      return;
    }

    this.userId = data.nameid;
    this.showButtons = data.role === roleToName(UserRoles.Accountant);
  }

  onClickMore(
    event: { event: PointerEvent; data: TableRows },
    op: OverlayPanel
  ) {
    const id = event.data.id;
    this.dataClicked = this.rows.find((r) => r.id === id);
    console.log(this.dataClicked);
    op.toggle(event.event);
  }

  onClickAdd() {
    this.router.navigate(['expense-reports/edit/expense']);
  }

  onClickEdit() {
    console.log(this.dataClicked);
    this.showModal = true;
    // this.router.navigate(['expense-reports/edit/expense'], {
    //   queryParams: { id: this.dataClicked?.id },
    // });
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

  changeStatus(status: number, id: string) {
    if (!this.notes.valid) {
      this.notes.markAllAsTouched();
      this.notes.updateValueAndValidity();
      return;
    }

    const notes = this.notes.value;

    const approval = {
      isApproved: status === 0,
      actionById: this.userId,
      actionDate: new Date().toISOString(),
      actionDateTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      accountingNotes:
        notes !== ''
          ? notes
          : status === 0
          ? 'Approved by accountant'
          : 'Rejected by accountant',
    };

    this.dialogService.confirm(
      `${status === 0 ? 'Approve' : 'Reject'} expense?`,
      `Are you sure you want to ${
        status === 0 ? 'approve' : 'reject'
      } this expense?`,
      () => {
        this.expenseServices.approveExpense(id, approval).subscribe(() => {
          this.toastService.showSuccess(
            `${status === 0 ? 'Approved' : 'Rejected'} expense`
          );

          const url = this.router.url;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([url]);
            });
        });
      },
      () => undefined
    );
  }
}

const columns: TableColumn[] = [
  { field: 'expenseAccount', header: 'account' },
  { field: 'amount', header: 'amount' },
  { field: 'date', header: 'date' },
  { field: 'dateIncurredTimeZone', header: 'time zone' },
  { field: 'explanation', header: 'explanation' },
  { field: 'status', header: 'status' },
  { field: 'actions', header: 'actions' },
];

interface TableRows {
  id: string;
  expenseAccount: string;
  amount: number;
  date: string;
  dateIncurredDate: string;
  dateIncurredTimeZone: string;
  status: string;
  explanation: string;
  receipt: string;

  actionById?: string;
  actionDate?: Date;
  actionDateTimeZone?: string;
  accountingNotes?: string;

  actionBy?: User;
}
