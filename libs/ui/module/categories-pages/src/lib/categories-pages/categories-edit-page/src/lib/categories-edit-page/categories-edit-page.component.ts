import { Component, OnInit } from '@angular/core';
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
  DialogService,
  ExpenseAccountCategoryService,
  ToastService,
} from '@expensesreport/services';
import { ExpenseAccountCategory } from '@expensesreport/models';
import { CategoryStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-categories-edit-page',
  standalone: true,
  templateUrl: './categories-edit-page.component.html',
  styleUrl: './categories-edit-page.component.css',
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
export class CategoriesEditPageComponent implements OnInit {
  id: string | null = null;
  expenseAccountCategory: ExpenseAccountCategory | null = null;

  loading = false;
  disabled = false;
  isDeleted = false;
  loadingState = false;
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
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.id = this.router.url.split('/').pop() || null;

    if (!this.id) {
      this.toastService.showError('Category not found');
      this.router.navigate(['/categories']);
      return;
    }

    this.loading = true;

    this.expenseAccountCategoryService.get(this.id).subscribe(
      (category) => {
        this.expenseAccountCategory = category;

        this.categoryFormGroup.patchValue({
          name: this.expenseAccountCategory.name,
          description: this.expenseAccountCategory.description,
        });

        this.isDeleted =
          this.expenseAccountCategory.status === CategoryStatus.Deleted;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.categoryFormGroup.invalid) {
      Object.keys(this.categoryFormGroup.controls).forEach((controlName) => {
        const control = this.categoryFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      this.toastService.showError('Invalid form');
      return;
    }

    if (!this.expenseAccountCategory) {
      this.toastService.showError('Category not found');
      return;
    }

    this.dialogService.confirm(
      'Are you sure you want to update this category?',
      'Update Category',
      () => {
        this.updateCategory();
      },
      () => undefined
    );
  }

  updateCategory() {
    if (!this.expenseAccountCategory) return;

    const categoryToUpdate: ExpenseAccountCategory = {
      ...this.expenseAccountCategory,
      name: this.categoryFormGroup.get('name')?.value as string,
      description: this.categoryFormGroup.get('description')?.value as string,
    };

    this.loading = true;

    this.expenseAccountCategoryService.update(categoryToUpdate).subscribe(
      () => {
        this.toastService.showSuccess('Category updated');
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/categories']);
  }

  onChangeStatus() {
    if (!this.expenseAccountCategory) {
      this.toastService.showError('Category not found');
      return;
    }

    const status = this.expenseAccountCategory.status;

    this.dialogService.confirm(
      `${status === CategoryStatus.Active ? 'Delete' : 'Restore'} Category`,
      `Are you sure you want to ${
        status === CategoryStatus.Active ? 'delete' : 'restore'
      } this department?`,
      () => {
        this.changeStatus(
          status === CategoryStatus.Active
            ? CategoryStatus.Deleted
            : CategoryStatus.Active
        );
      },
      () => undefined
    );
  }

  changeStatus(categoryStatus: CategoryStatus) {
    if (!this.expenseAccountCategory) return;

    this.loadingState = true;

    this.expenseAccountCategoryService
      .updateStatus(this.expenseAccountCategory.id as string, categoryStatus)
      .subscribe(
        (expenseAccountCategory) => {
          this.toastService.showSuccess(
            `Category ${
              categoryStatus === CategoryStatus.Active ? 'restored' : 'deleted'
            }`
          );

          if (this.expenseAccountCategory) {
            this.expenseAccountCategory = {
              ...this.expenseAccountCategory,
              status: expenseAccountCategory.status,
            };

            this.isDeleted =
              expenseAccountCategory.status === CategoryStatus.Deleted;
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
