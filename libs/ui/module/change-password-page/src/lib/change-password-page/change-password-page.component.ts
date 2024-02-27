import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  PageComponent,
  PageContentComponent,
  TitleComponent,
  FormGroupComponent,
  InputPasswordComponent,
  LabelComponent,
  ButtonComponent,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'expensesreport-change-password-page',
  standalone: true,
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageComponent,
    PageContentComponent,
    TitleComponent,
    FormGroupComponent,
    InputPasswordComponent,
    LabelComponent,
    ButtonComponent,
    ProgressSpinnerModule,
  ],
})
export class ChangePasswordPageComponent {
  loading = false;
  checkingToken = false;
  tokenValid = true;
  disabled = false;
  changePasswordFormGroup = new FormGroup({
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

  onSubmit() {
    this.loading = true;
  }

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
      this.changePasswordFormGroup &&
      control.value !== this.changePasswordFormGroup.get('password')?.value
    ) {
      return { passwordNotMatch: true };
    }

    return null;
  }
}
