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
import { ExpenseAccount, ExpenseAccountCategory } from '@expensesreport/models';
import {
  ExpenseAccountCategoryService,
  ExpenseAccountService,
  ToastService,
} from '@expensesreport/services';
import { ExpenseAccountType } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-expense-accounts-create-page',
  standalone: true,
  templateUrl: './expense-accounts-create-page.component.html',
  styleUrl: './expense-accounts-create-page.component.css',
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
export class ExpenseAccountsCreatePageComponent implements OnInit {
  categories: SelectItem[] = [];
  types: SelectItem[] = [];

  loading = false;
  disabled = false;

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
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.expenseAccountCategoryService.getAll().subscribe(
      (categories) => {
        this.categories = categories.map((category) => {
          return {
            label: category.name,
            value: category.id || '',
          };
        });

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

    if (code && code !== '') {
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

      return;
    }

    const expenseAccount: ExpenseAccount = {
      name: this.expenseAccountFormGroup.controls.name.value || '',
      code: this.expenseAccountFormGroup.controls.code.value || '',
      description:
        this.expenseAccountFormGroup.controls.description.value || '',
      type: Number(this.expenseAccountFormGroup.controls.type.value),
      categoryId: this.expenseAccountFormGroup.controls.category.value || '',
    };

    this.disabled = true;
    this.loading = true;

    this.expenseAccountService.create(expenseAccount).subscribe(
      () => {
        this.toastService.showSuccess('Expense account created');
        this.router.navigate(['/expense-accounts']);
      },
      (error) => {
        this.toastService.showError(error);
        this.disabled = false;
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/expense-accounts']);
  }
}
