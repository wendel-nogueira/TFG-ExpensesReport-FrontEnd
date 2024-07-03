import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
  SelectComponent,
  FormGroupComponent,
  LabelComponent,
  ButtonComponent,
  TextAreaComponent,
  SelectItem,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  DialogService,
  ExpenseAccountCategoryService,
  ExpenseAccountService,
  ToastService,
} from '@expensesreport/services';
import { ExpenseAccount } from '@expensesreport/models';
import {
  ExpenseAccountStatus,
  ExpenseAccountType,
} from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-expense-accounts-edit-page',
  standalone: true,
  templateUrl: './expense-accounts-edit-page.component.html',
  styleUrl: './expense-accounts-edit-page.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    TextAreaComponent,
    SelectComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ExpenseAccountsEditPageComponent implements OnInit {
  id: string | null = null;
  expenseAccount: ExpenseAccount | null = null;

  categories: SelectItem[] = [];
  types: SelectItem[] = [];

  loading = false;
  disabled = false;
  isDeleted = false;
  loadingState = false;

  expenseAccountFormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]),
    description: new FormControl('', [Validators.maxLength(100)]),
    type: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
  });
  nameErrors = {
    required: 'Name is required',
    minlength: 'Name must be at least 3 characters',
    maxlength: 'Name must be at most 50 characters',
  };
  codeErrors = {
    required: 'Code is required',
    minlength: 'Code must be at least 2 characters',
    maxlength: 'Code must be at most 10 characters',
    exists: 'Code already exists',
  };
  descriptionErrors = {
    maxlength: 'Description must be at most 100 characters',
  };

  constructor(
    private router: Router,
    private expenseAccountService: ExpenseAccountService,
    private expenseAccountCategoryService: ExpenseAccountCategoryService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.id = this.router.url.split('/').pop() || null;

    if (!this.id || this.id === null) {
      this.toastService.showError('Account not found');
      this.router.navigate(['/expense-accounts']);
      return;
    }

    this.loading = true;

    const types = Object.keys(ExpenseAccountType).filter(
      (key) =>
        !isNaN(
          Number(ExpenseAccountType[key as keyof typeof ExpenseAccountType])
        )
    );

    this.types = types.map((type) => {
      return {
        label: type,
        value:
          ExpenseAccountType[
            type as keyof typeof ExpenseAccountType
          ].toString(),
      };
    });

    this.expenseAccountCategoryService.getAll().subscribe(
      (categories) => {
        this.categories = categories.map((category) => {
          return {
            label: category.name,
            value: category.id || '',
          };
        });
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );

    this.expenseAccountService.get(this.id).subscribe(
      (expenseAccount) => {
        this.expenseAccount = expenseAccount;

        this.expenseAccountFormGroup.patchValue({
          name: expenseAccount.name,
          code: expenseAccount.code,
          description: expenseAccount.description,
          type: expenseAccount.type.toString(),
          category: expenseAccount.category?.id || '',
        });

        this.isDeleted = expenseAccount.status === ExpenseAccountStatus.Deleted;

        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onCodeChange(event: Event) {
    const code = (event.target as HTMLInputElement).value;

    if (this.expenseAccountFormGroup.controls.code.invalid) {
      this.expenseAccountFormGroup.controls.code.markAllAsTouched();
      this.expenseAccountFormGroup.controls.code.updateValueAndValidity();

      return;
    }

    if (code && code !== '' && this.expenseAccount?.code !== code) {
      this.expenseAccountService.checkIfCodeExists(code).subscribe(
        (response) => {
          if (response) {
            this.expenseAccountFormGroup.controls.code.setErrors({
              exists: true,
            });
          }
        },
        () => {
          this.toastService.showError('Error checking code');
        }
      );
    }
  }

  onSubmit() {
    if (this.expenseAccountFormGroup.invalid) {
      Object.keys(this.expenseAccountFormGroup.controls).forEach(
        (controlName) => {
          const control = this.expenseAccountFormGroup.get(controlName);

          if (control) {
            control.markAsTouched();
            if (!(controlName === 'code')) control.updateValueAndValidity();
          }
        }
      );

      this.toastService.showError('Invalid form');
      return;
    }

    if (!this.expenseAccount) {
      this.toastService.showError('Account not found');
      return;
    }

    this.dialogService.confirm(
      'Update Account',
      'Are you sure you want to update this account?',
      () => {
        this.updateExpenseAccount();
      },
      () => undefined
    );
  }

  updateExpenseAccount() {
    if (!this.expenseAccount) return;

    const accountToUpdate: ExpenseAccount = {
      ...this.expenseAccount,
      name: this.expenseAccountFormGroup.controls.name.value || '',
      code: this.expenseAccountFormGroup.controls.code.value || '',
      description:
        this.expenseAccountFormGroup.controls.description.value || '',
      type: Number(this.expenseAccountFormGroup.controls.type.value),
      categoryId: this.expenseAccountFormGroup.controls.category.value || '',
    };

    this.loading = true;

    this.expenseAccountService.update(accountToUpdate).subscribe(
      () => {
        this.toastService.showSuccess('Account updated');
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/expense-accounts']);
  }

  onChangeStatus() {
    if (!this.expenseAccount) {
      this.toastService.showError('Account not found');
      return;
    }

    const status = this.expenseAccount.status;

    this.dialogService.confirm(
      `${
        status === ExpenseAccountStatus.Active ? 'Delete' : 'Restore'
      } Account`,
      `Are you sure you want to ${
        status === ExpenseAccountStatus.Active ? 'delete' : 'restore'
      } this account?`,
      () => {
        this.changeStatus(
          status === ExpenseAccountStatus.Active
            ? ExpenseAccountStatus.Deleted
            : ExpenseAccountStatus.Active
        );
      },
      () => undefined
    );
  }

  changeStatus(expenseAccountStatus: ExpenseAccountStatus) {
    if (!this.expenseAccount) return;

    this.loadingState = true;

    this.expenseAccountService
      .updateStatus(this.expenseAccount.id as string, expenseAccountStatus)
      .subscribe(
        (expenseAccount) => {
          this.toastService.showSuccess(
            `Account ${
              expenseAccountStatus === ExpenseAccountStatus.Active
                ? 'restored'
                : 'deleted'
            }`
          );

          if (this.expenseAccount) {
            this.expenseAccount = {
              ...this.expenseAccount,
              status: expenseAccount.status,
            };

            this.isDeleted =
              expenseAccount.status === ExpenseAccountStatus.Deleted;
          }

          this.loadingState = false;
        },
        (error) => {
          this.toastService.showError(error);
          this.loadingState = false;
        }
      );
  }
}
