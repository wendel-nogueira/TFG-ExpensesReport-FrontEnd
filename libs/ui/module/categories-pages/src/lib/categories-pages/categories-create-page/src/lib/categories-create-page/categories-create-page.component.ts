import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
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
import {
  ExpenseAccountCategoryService,
  ToastService,
} from '@expensesreport/services';
import { ExpenseAccountCategory } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-categories-create-page',
  standalone: true,
  templateUrl: './categories-create-page.component.html',
  styleUrl: './categories-create-page.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    TextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CategoriesCreatePageComponent {
  loading = false;
  disabled = false;
  categoryFormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    description: new FormControl('', [Validators.maxLength(2000)]),
  });
  nameErrors = {
    required: 'Name is required',
    minlength: 'Name must be at least 3 characters',
    maxlength: 'Name must be at most 50 characters',
  };
  descriptionErrors = {
    maxlength: 'Description must be at most 2000 characters',
  };

  constructor(
    private router: Router,
    private expenseAccountCategoryService: ExpenseAccountCategoryService,
    private toastService: ToastService
  ) {}

  onSubmit() {
    if (this.categoryFormGroup.invalid) {
      this.categoryFormGroup.controls.name.markAllAsTouched();
      this.categoryFormGroup.controls.name.updateValueAndValidity();
      this.categoryFormGroup.controls.description.markAllAsTouched();
      this.categoryFormGroup.controls.description.updateValueAndValidity();

      this.toastService.showError('Invalid form');
      return;
    }

    this.loading = true;

    const expenseAccountCategory: ExpenseAccountCategory = {
      name: this.categoryFormGroup.controls.name.value as string,
      description: this.categoryFormGroup.controls.description.value as string,
    };

    this.expenseAccountCategoryService.create(expenseAccountCategory).subscribe(
      () => {
        this.toastService.showSuccess('Category created');
        this.router.navigate(['/categories']);
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/categories']);
  }
}
