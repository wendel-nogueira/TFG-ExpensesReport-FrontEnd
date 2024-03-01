import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  PageComponent,
  PageContentComponent,
  TitleComponent,
  ButtonComponent,
} from '@expensesreport/ui';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-change-password-page',
  standalone: true,
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageComponent,
    PageContentComponent,
    TitleComponent,
    ButtonComponent,
    ProgressSpinnerModule,
    PasswordComponent,
  ],
})
export class ChangePasswordPageComponent {
  loading = false;
  checkingToken = false;
  tokenValid = true;
  disabled = false;

  changePasswordFormGroup = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  onSubmit() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.setErrors({
        invalid: true,
      });

      return;
    }

    console.log('submit');
    console.log(this.changePasswordFormGroup.value);

    this.loading = true;
  }
}
