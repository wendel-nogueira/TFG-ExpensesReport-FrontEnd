import { Component, Input, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'expensesreport-input-password',
  standalone: true,
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.css',
  imports: [CommonModule, InputTextModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputPasswordComponent,
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor, OnInit {
  @Input() id = '';
  @Input() formControl = new FormControl('');
  @Input() useError = false;

  value: string | null = null;
  onChange: any = () => {};
  onTouch: any = () => {};

  showPassword = false;
  errorMessage = '';
  errors = {
    required: 'Required',
    minlength: 'Password must be at least 8 characters long',
    maxlength: 'Password must be at most 16 characters long',
    passwordInvalid:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    passwordNotMatch: 'Passwords do not match',
  };

  ngOnInit() {
    if (this.formControl.value) {
      this.checkErrors();
    }

    this.formControl.statusChanges.subscribe(() => {
      if (this.formControl.errors && this.formControl.touched) {
        this.checkErrors();
      }
    });
  }

  writeValue(value: string): void {
    if (value) this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  checkErrors() {
    const errors = this.formControl.errors as any;

    if (errors) {
      const keys = Object.keys(errors);

      if (keys.length > 0) {
        this.errorMessage = this.errors[keys[0] as keyof typeof this.errors];
      } else {
        this.errorMessage = '';
      }
    }
  }
}
