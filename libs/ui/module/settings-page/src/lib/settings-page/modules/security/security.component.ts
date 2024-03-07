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
import { AuthService, IdentityService } from '@expensesreport/services';
import { TokenData } from '@expensesreport/models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
  ],
})
export class SecurityComponent implements OnInit {
  info: TokenData | null = null;
  loading = false;
  disabled = false;
  loadingRecoveryPass = false;

  emailFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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
  };

  constructor(
    private identityService: IdentityService,
    private authServive: AuthService
  ) {}

  ngOnInit() {
    this.info = this.authServive.getSessionData();
  }

  onSubmit() {
    if (!this.info) return;

    if (this.emailFormGroup.invalid) {
      this.emailFormGroup.controls.email.markAllAsTouched();
      this.emailFormGroup.controls.repeatEmail.markAllAsTouched();

      this.emailFormGroup.controls.email.updateValueAndValidity();
      this.emailFormGroup.controls.repeatEmail.updateValueAndValidity();
      return;
    }

  }

  forgotPassword() {
    if (!this.info) return;

    const email = this.info.email;

    this.loadingRecoveryPass = true;

    this.identityService.sendResetPasswordEmail(email).subscribe(
      () => {
        this.loadingRecoveryPass = false;
      },
      () => {
        this.loadingRecoveryPass = false;
      }
    );
  }

  validateEmailMatch(control: AbstractControl) {
    if (
      this.emailFormGroup &&
      control.value !== this.emailFormGroup.get('email')?.value
    ) {
      return { emailNotMatch: true };
    }

    return null;
  }
}
