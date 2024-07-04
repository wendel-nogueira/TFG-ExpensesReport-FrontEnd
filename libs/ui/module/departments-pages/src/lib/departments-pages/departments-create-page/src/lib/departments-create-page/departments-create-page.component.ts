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
import { DepartmentService, ToastService } from '@expensesreport/services';
import { Department } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-departments-create-page',
  standalone: true,
  templateUrl: './departments-create-page.component.html',
  styleUrl: './departments-create-page.component.css',
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
export class DepartmentsCreatePageComponent {
  loading = false;
  disabled = false;
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

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

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
          if (response) {
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
      this.departmentFormGroup.controls.name.markAllAsTouched();
      this.departmentFormGroup.controls.name.updateValueAndValidity();
      this.departmentFormGroup.controls.acronym.markAllAsTouched();
      this.departmentFormGroup.controls.description.markAllAsTouched();
      this.departmentFormGroup.controls.description.updateValueAndValidity();

      this.toastService.showError('Invalid form');
      return;
    }

    this.loading = true;

    const department: Department = {
      name: this.departmentFormGroup.controls.name.value as string,
      acronym: this.departmentFormGroup.controls.acronym.value as string,
      description: this.departmentFormGroup.controls.description
        .value as string,
    };

    this.departmentService.create(department).subscribe(
      () => {
        this.toastService.showSuccess('Department created');
        this.router.navigate(['/departments']);
      },
      (error) => {
        console.error(error);
        this.toastService.showError('An error occurred');
        this.loading = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/departments']);
  }
}
