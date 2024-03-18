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
  selector: 'expensesreport-departments-edit-page',
  standalone: true,
  templateUrl: './departments-edit-page.component.html',
  styleUrl: './departments-edit-page.component.css',
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
export class DepartmentsEditPageComponent {
  loading = false;
  disabled = false;
  isDeactivated = false;

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
    description: new FormControl('', [Validators.maxLength(100)]),
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
  };
  descriptionErrors = {
    maxlength: 'Description must be at most 100 characters',
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.departmentFormGroup.invalid) {
      Object.keys(this.departmentFormGroup.controls).forEach((controlName) => {
        const control = this.departmentFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      return;
    }

    console.log(this.departmentFormGroup.value);
  }

  onBack() {
    this.router.navigate(['/departments']);
  }

  onDeactivate() {
    console.log('Deactivate');
  }

  onActivate() {
    console.log('Activate');
  }
}
