import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
  SelectComponent,
  FormGroupComponent,
  LabelComponent,
  ButtonComponent,
  TextAreaComponent,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

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
export class ExpenseAccountsEditPageComponent {
  loading = false;
  disabled = false;
  types = types;
  isDeactivated = false;

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

  constructor(private router: Router) {}

  onSubmit() {
    if (this.expenseAccountFormGroup.invalid) {
      Object.keys(this.expenseAccountFormGroup.controls).forEach(
        (controlName) => {
          const control = this.expenseAccountFormGroup.get(controlName);

          if (control) {
            control.markAsTouched();
            control.updateValueAndValidity();
          }
        }
      );

      return;
    }

    console.log(this.expenseAccountFormGroup.value);
  }

  onBack() {
    this.router.navigate(['/expense-accounts']);
  }

  onDeactivate() {
    console.log('Deactivate');
  }

  onActivate() {
    console.log('Activate');
  }
}

const types = [
  {
    label: 'Asset',
    value: 'asset',
  },
  {
    label: 'Expense',
    value: 'expense',
  },
];
