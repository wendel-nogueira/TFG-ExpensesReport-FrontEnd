import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
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
import { Department } from '@expensesreport/models';
import {
  DepartmentService,
  DialogService,
  ToastService,
} from '@expensesreport/services';
import { DepartmentStatus } from '@expensesreport/enums';

@Component({
  selector: 'expensesreport-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
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
  ],
})
export class EditComponent implements OnChanges {
  @Input() id: string | null = null;
  @Input() department: Department | null = null;
  @Input() loading = false;
  @Input() disabled = false;

  isDeleted = false;
  loadingState = false;

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnChanges(changes: { id: SimpleChange; department: SimpleChange }) {
    if (changes.id)
      this.id = changes.id.currentValue ? changes.id.currentValue : null;

    if (changes.department) {
      this.department = changes.department.currentValue
        ? changes.department.currentValue
        : null;

      if (this.department) {
        this.departmentFormGroup.patchValue({
          name: this.department.name,
          acronym: this.department.acronym,
          description: this.department.description,
        });

        this.isDeleted = this.department.status === DepartmentStatus.Deleted;
      }
    }
  }

  departmentFormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    acronym: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]),
    description: new FormControl('', [Validators.maxLength(2000)]),
  });
  nameErrors = {
    required: 'Name is required',
    minlength: 'Name must be at least 3 characters',
    maxlength: 'Name must be at most 50 characters',
  };
  acronymErrors = {
    required: 'Acronym is required',
    minlength: 'Acronym must be at least 2 characters',
    maxlength: 'Acronym must be at most 10 characters',
    exists: 'Acronym already exists',
  };
  descriptionErrors = {
    maxlength: 'Description must be at most 2000 characters',
  };

  onAcronymChange(event: Event) {
    const acronym = (event.target as HTMLInputElement).value;

    if (this.departmentFormGroup.controls.acronym.invalid) {
      this.departmentFormGroup.controls.acronym.markAllAsTouched();
      this.departmentFormGroup.controls.acronym.updateValueAndValidity();

      return;
    }

    if (acronym && acronym !== '') {
      this.departmentService.checkIfAcronymExists(acronym).subscribe(
        (response) => {
          if (response && this.department?.acronym !== acronym) {
            this.departmentFormGroup.controls.acronym.setErrors({
              exists: true,
            });
          }
        },
        () => {
          this.toastService.showError('Error checking acronym');
        }
      );
    }
  }

  onSubmit() {
    if (this.departmentFormGroup.invalid) {
      Object.keys(this.departmentFormGroup.controls).forEach((controlName) => {
        const control = this.departmentFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      this.toastService.showError('Invalid form');
      return;
    }

    if (!this.department) {
      this.toastService.showError('Department not found');
      return;
    }

    this.dialogService.confirm(
      'Are you sure you want to update this department?',
      'Update Department',
      () => {
        this.updateDepartment();
      },
      () => undefined
    );
  }

  updateDepartment() {
    if (!this.department) return;

    const departmentToUpdate: Department = {
      ...this.department,
      name: this.departmentFormGroup.get('name')?.value as string,
      acronym: this.departmentFormGroup.get('acronym')?.value as string,
      description: this.departmentFormGroup.get('description')?.value as string,
    };

    this.loading = true;

    this.departmentService.update(departmentToUpdate).subscribe(
      () => {
        this.toastService.showSuccess('Department updated');
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/departments']);
  }

  onChangeStatus() {
    if (!this.department) {
      this.toastService.showError('Department not found');
      return;
    }

    const status = this.department.status;

    this.dialogService.confirm(
      `${status === DepartmentStatus.Active ? 'Delete' : 'Restore'} Department`,
      `Are you sure you want to ${
        status === DepartmentStatus.Active ? 'delete' : 'restore'
      } this department?`,
      () => {
        this.changeStatus(
          status === DepartmentStatus.Active
            ? DepartmentStatus.Deleted
            : DepartmentStatus.Active
        );
      },
      () => undefined
    );
  }

  changeStatus(departmentStatus: DepartmentStatus) {
    if (!this.department) return;

    this.loadingState = true;

    this.departmentService
      .updateStatus(this.department.id as string, departmentStatus)
      .subscribe(
        (department) => {
          this.toastService.showSuccess(
            `Department ${
              departmentStatus === DepartmentStatus.Active
                ? 'restored'
                : 'deleted'
            }`
          );

          if (this.department) {
            this.department = {
              ...this.department,
              status: department.status,
            };

            this.isDeleted = department.status === DepartmentStatus.Deleted;
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
