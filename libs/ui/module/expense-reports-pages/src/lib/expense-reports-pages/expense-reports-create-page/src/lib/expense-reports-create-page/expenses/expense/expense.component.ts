import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense, ExpenseAccount } from '@expensesreport/models';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  FormGroupComponent,
  InputTextComponent,
  LabelComponent,
  PageContentComponent,
  SelectComponent,
  TextAreaComponent,
  UploadComponent,
  CalendarComponent,
  SelectItem,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseAccountService } from '@expensesreport/services';
import { ExpenseAccountStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-expense',
  standalone: true,
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    SelectComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    TextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
    UploadComponent,
    CalendarComponent,
  ],
})
export class ExpenseComponent implements OnInit {
  id: string | undefined;
  editMode = false;
  loading = false;
  disabled = false;

  allExpenseAccounts: ExpenseAccount[] = [];
  expenseAccounts: SelectItem[] = [];

  expenseFormGroup = new FormGroup({
    expenseAccount: new FormControl('', [Validators.required]),
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0.01),
      Validators.max(999999999),
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    dateIncurred: new FormControl('', [Validators.required]),
    explanation: new FormControl('', [
      Validators.required,
      Validators.maxLength(2000),
    ]),
    file: new FormControl('', [Validators.required]),
  });
  amountErrors = {
    required: 'Amount is required',
    min: 'Amount must be at least 0.01',
    max: 'Amount must be at most 999999999',
    pattern: 'Amount must be a valid number',
  };
  dateIncurredErrors = {
    required: 'Date incurred is required',
  };
  explanationErrors = {
    maxlength: 'Description must be at most 2000 characters',
  };

  constructor(
    public expenseService: ExpenseService,
    private expenseAccountService: ExpenseAccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const queryParam = this.router.url.split('?')[1];

    if (queryParam) {
      const id = queryParam.split('=')[1];
      const expense = this.expenseService.getExpense(id);

      if (expense) {
        this.id = id;
        this.editMode = true;

        this.expenseFormGroup.setValue({
          expenseAccount: expense.expenseAccountId as string,
          amount: expense.amount.toString(),
          dateIncurred: expense.dateIncurred,
          explanation: expense.explanation,
          file: expense.receipt,
        });

        console.log(expense);
      } else {
        this.router.navigate(['expense-reports/create']);
      }
    }

    this.loading = true;

    this.expenseAccountService.getAll().subscribe((accounts) => {
      this.allExpenseAccounts = accounts;

      this.expenseAccounts = accounts
        .filter((account) => account.status === ExpenseAccountStatus.Active)
        .map((account) => {
          return {
            label: account.name,
            value: account.id as string,
          };
        });

      this.loading = false;
    });
  }

  onSubmit() {
    console.log(this.expenseFormGroup);
    if (this.expenseFormGroup.invalid) {
      Object.keys(this.expenseFormGroup.controls).forEach((controlName) => {
        const control = this.expenseFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      return;
    }

    const dateIncurredTimeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    const expense: Expense = {
      id:
        this.id !== undefined
          ? this.id
          : Math.random().toString(36).substr(2, 9),
      expenseAccountId: this.expenseFormGroup.value.expenseAccount as string,
      expenseAccountName: this.allExpenseAccounts.find(
        (e) => e.id === this.expenseFormGroup.value.expenseAccount
      )?.name as string,
      amount: parseFloat(this.expenseFormGroup.value.amount as string),
      dateIncurred: this.expenseFormGroup.value.dateIncurred as string,
      dateIncurredTimeZone: dateIncurredTimeZone,
      explanation: this.expenseFormGroup.value.explanation as string,
      receipt: this.expenseFormGroup.value.file as string,
    };

    if (this.editMode) {
      this.expenseService.editExpense(expense);
    } else {
      this.expenseService.addExpense(expense);
    }

    this.router.navigate(['expense-reports/create']);
  }

  onBack() {
    this.router.navigate(['expense-reports/create']);
  }
}
