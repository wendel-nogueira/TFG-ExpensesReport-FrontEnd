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
  selector: 'expensesreport-recovery-pass',
  standalone: true,
  templateUrl: './recovery-pass.component.html',
  styleUrl: './recovery-pass.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormGroupComponent,
    LabelComponent,
    InputTextComponent,
    ButtonComponent,
    DialogModule,
  ],
})
export class RecoveryPassComponent {
  @Input() recoveryPass = false;
  @Output() closeRecoveryPass = new EventEmitter();

  loadingRecoveryPass = false;
  recoveryPassFormGroup = new FormGroup({
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
    if (this.recoveryPassFormGroup.invalid) {
      this.recoveryPassFormGroup.controls.email.markAllAsTouched();
      this.recoveryPassFormGroup.controls.email.updateValueAndValidity();

      return;
    }

    const email = this.recoveryPassFormGroup.value.email || '';

    this.loadingRecoveryPass = true;

    this.identityService.sendResetPasswordEmail(email).subscribe(
      () => {
        this.loadingRecoveryPass = false;
        this.toastService.showSuccess('Email sent');
        this.close();
      },
      () => {
        this.loadingRecoveryPass = false;
        this.toastService.showError('Error sending email');
        this.close();
      }
    );
  }

  close() {
    this.recoveryPassFormGroup.controls.email.setValue('');
    this.recoveryPassFormGroup.controls.email.markAsUntouched();
    this.closeRecoveryPass.emit();
  }
}
