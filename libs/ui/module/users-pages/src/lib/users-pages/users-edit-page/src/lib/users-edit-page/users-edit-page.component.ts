import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
  SelectComponent,
  FormGroupComponent,
  LabelComponent,
  ButtonComponent,
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
  selector: 'expensesreport-users-edit-page',
  standalone: true,
  templateUrl: './users-edit-page.component.html',
  styleUrl: './users-edit-page.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    SelectComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsersEditPageComponent {
  loading = false;
  disabled = false;
  isDeactivated = false;
  roles = roles;

  userFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
  });
  emailErrors = {
    email: 'Email is invalid',
    exists: 'Email already exists',
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.userFormGroup.invalid) {
      Object.keys(this.userFormGroup.controls).forEach((controlName) => {
        const control = this.userFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      return;
    }

    console.log(this.userFormGroup.value);
  }

  onBack() {
    this.router.navigate(['/users']);
  }

  onDeactivate() {
    console.log('Deactivate');
  }

  onActivate() {
    console.log('Activate');
  }
}

const roles = [
  {
    label: 'Field Staff',
    value: 'fieldStaff',
  },
  {
    label: 'Manager',
    value: 'manager',
  },
  {
    label: 'Accountant',
    value: 'accountant',
  },
];
