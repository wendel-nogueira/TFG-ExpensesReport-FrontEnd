import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroupComponent,
  InputPasswordComponent,
  LabelComponent,
} from '../../index';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Password } from '../../../../core/models/Password';

@Component({
  selector: 'expensesreport-password',
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormGroupComponent,
    InputPasswordComponent,
    LabelComponent,
  ],
})
export class PasswordComponent implements OnInit {
  @Input() password: Password | null = null;
  @Input() useRowLayout = false;
  @Output() passwordFormGroup = new EventEmitter<FormGroup>();

  passwordFormGroupLocal = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      this.validatePassword.bind(this),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      this.validatePasswordMatch.bind(this),
    ]),
  });

  validatePassword(control: AbstractControl) {
    const passwordRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
    );

    if (!passwordRegex.test(control.value)) {
      return { passwordInvalid: true };
    }

    return null;
  }

  validatePasswordMatch(control: AbstractControl) {
    if (
      this.passwordFormGroupLocal &&
      control.value !== this.passwordFormGroupLocal.get('password')?.value
    ) {
      return { passwordNotMatch: true };
    }

    return null;
  }

  ngOnInit() {
    if (this.password) {
      this.passwordFormGroupLocal.patchValue(this.password);
    }

    this.passwordFormGroupLocal.statusChanges.subscribe(() => {
      if (this.passwordFormGroupLocal.errors) {
        this.passwordFormGroupLocal.setErrors(null);

        Object.keys(this.passwordFormGroupLocal.controls).forEach(
          (controlName) => {
            const control = this.passwordFormGroupLocal.get(controlName);

            if (control) {
              control.markAsTouched();
              control.updateValueAndValidity();
            }
          }
        );

        return;
      }
    });

    this.passwordFormGroup.emit(this.passwordFormGroupLocal);
  }
}
