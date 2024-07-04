import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FormGroupComponent,
  LabelComponent,
  InputTextComponent,
  ButtonComponent,
} from '@expensesreport/ui';
import { DialogModule } from 'primeng/dialog';
import { IdentityService, ToastService } from '@expensesreport/services';

@Component({
  selector: 'expensesreport-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormGroupComponent,
    LabelComponent,
    InputTextComponent,
    ButtonComponent,
    DialogModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Input() createAccount = false;
  @Output() closeCreateAccount = new EventEmitter();

  loadingCreateAccount = false;
  createAccountFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  emailErrors = {
    email: 'Email is invalid',
  };

  constructor(
    private identityService: IdentityService,
    private toastService: ToastService
  ) {}

  forgotPassword() {
    if (this.createAccountFormGroup.invalid) {
      this.createAccountFormGroup.controls.email.markAllAsTouched();
      this.createAccountFormGroup.controls.email.updateValueAndValidity();

      return;
    }

    const email = this.createAccountFormGroup.value.email || '';

    this.loadingCreateAccount = true;

    this.identityService.sendCreateAccountEmail(email).subscribe(
      () => {
        this.loadingCreateAccount = false;
        this.toastService.showSuccess('Email sent, check your inbox');
        this.close();
      },
      () => {
        this.loadingCreateAccount = false;
        this.toastService.showError('Error sending email');
        this.close();
      }
    );
  }

  close() {
    this.createAccountFormGroup.controls.email.setValue('');
    this.createAccountFormGroup.controls.email.markAsUntouched();
    this.closeCreateAccount.emit();
  }
}
