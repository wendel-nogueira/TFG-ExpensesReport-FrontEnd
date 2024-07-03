import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { PageComponent } from '../../components/page/page.component';
import {
  ButtonComponent,
  FormGroupComponent,
  LabelComponent,
  InputTextComponent,
} from '@expensesreport/ui';
import {
  AuthService,
  DialogService,
  IdentityService,
  ToastService,
} from '@expensesreport/services';
import { TokenData } from '@expensesreport/models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'expensesreport-security',
  standalone: true,
  templateUrl: './security.component.html',
  styleUrl: './security.component.css',
  imports: [
    CommonModule,
    ContainerComponent,
    PageComponent,
    ButtonComponent,
    FormGroupComponent,
    LabelComponent,
    InputTextComponent,

    FormsModule,
    ReactiveFormsModule,
    DialogModule,
  ],
})
export class SecurityComponent implements OnInit {
  info: TokenData | null = null;
  loading = false;
  disabled = false;
  loadingRecoveryPass = false;
  emailSent = false;
  showConfirmationCode = false;

  emailFormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.validateEmailMatch.bind(this),
    ]),
    repeatEmail: new FormControl('', [
      Validators.required,
      Validators.email,
      this.validateEmailMatch.bind(this),
    ]),
  });
  emailErrors = {
    email: 'Email is invalid',
    required: 'Email is required',
    emailNotMatch: 'Emails do not match',
    emailExists: 'Email already exists',
  };

  loadingConfirmationCode = false;
  confirmationCodeFormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });
  codeErrors = {
    required: 'Code is required',
  };

  constructor(
    private identityService: IdentityService,
    private authServive: AuthService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.info = this.authServive.getSessionData();
  }

  onEmailChange(event: Event) {
    const email = (event.target as HTMLInputElement).value;

    if (email && email !== '') {
      this.identityService.checkIfEmailExists(email).subscribe(
        (response) => {
          if (response) {
            this.emailFormGroup.controls.email.setErrors({ emailExists: true });
          }
        },
        () => {
          this.toastService.showError('Error checking email');
        }
      );
    }
  }

  onSubmit() {
    if (!this.info || this.disabled) return;

    const errors = Object.keys(
      (this.emailFormGroup.controls.email.errors ||
        this.emailFormGroup.controls.repeatEmail.errors) as any
    );

    if (errors.length > 0) {
      this.emailFormGroup.controls.email.markAllAsTouched();
      this.emailFormGroup.controls.repeatEmail.markAllAsTouched();

      this.toastService.showError('Invalid form');
      return;
    }

    this.dialogService.confirm(
      'Change email',
      'Are you sure you want to change your email?',
      () => {
        this.changeEmail();
      },
      () => undefined
    );
  }

  changeEmail() {
    if (!this.info) return;

    const email = this.emailFormGroup.controls.email.value;

    if (!email) return;

    this.identityService.sendChangeEmailEmail(email).subscribe(
      () => {
        this.toastService.showSuccess('Email sent');
        this.disabled = true;
        this.showConfirmationCode = true;
      },
      () => {
        this.toastService.showError('Error sending email');
      }
    );
  }

  forgotPassword() {
    if (!this.info) return;

    const email = this.info.email;

    this.loadingRecoveryPass = true;

    this.identityService.sendResetPasswordEmail(email).subscribe(
      () => {
        this.loadingRecoveryPass = false;
        this.toastService.showSuccess('Email sent');
        this.emailSent = true;
      },
      () => {
        this.loadingRecoveryPass = false;
        this.toastService.showError('Error sending email');
      }
    );
  }

  confirmCode() {
    if (!this.info) return;

    if (this.confirmationCodeFormGroup.invalid) {
      this.confirmationCodeFormGroup.controls.code.markAllAsTouched();
      return;
    }

    this.loadingConfirmationCode = true;

    const code = this.confirmationCodeFormGroup.controls.code.value;
    const email = this.emailFormGroup.controls.email.value;
    const repeatEmail = this.emailFormGroup.controls.repeatEmail.value;

    if (!code || !email || !repeatEmail) {
      this.toastService.showError('Error confirming code');

      this.loadingConfirmationCode = false;
      this.disabled = false;
      this.showConfirmationCode = false;

      return;
    }

    const data: {
      changeEmailToken: string;
      newEmail: string;
      confirmEmail: string;
    } = {
      changeEmailToken: code,
      newEmail: email,
      confirmEmail: repeatEmail,
    };

    this.identityService.confirmChangeEmail(data).subscribe(
      () => {
        this.toastService.showSuccess('Email changed successfully');
        this.disabled = false;
        this.showConfirmationCode = false;
        this.loadingConfirmationCode = false;

        this.authServive.logout();
      },
      () => {
        this.toastService.showError('Error confirming code');
        this.loadingConfirmationCode = false;
      }
    );
  }

  validateEmailMatch(control: AbstractControl) {
    const parent = control.parent as FormGroup | null;

    if (!parent) return null;

    const email = parent.get('email');
    const repeatEmail = parent.get('repeatEmail');

    if (!email || !repeatEmail) return null;

    if (email.value === repeatEmail.value) {
      const emailErrors = email.errors;
      const repeatErrors = repeatEmail.errors;

      if (emailErrors && email.errors['emailNotMatch']) {
        delete emailErrors['emailNotMatch'];
        email.setErrors(emailErrors);
      }

      if (repeatErrors && repeatEmail.errors['emailNotMatch']) {
        delete repeatErrors['emailNotMatch'];
        repeatEmail.setErrors(repeatErrors);
      }

      return null;
    }

    return { emailNotMatch: true };
  }
}
