import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  PageComponent,
  PageContentComponent,
  TitleComponent,
  InputTextComponent,
  InputPasswordComponent,
  FormGroupComponent,
  DividerComponent,
  LabelComponent,
  CheckboxComponent,
  ButtonComponent,
  ToastComponent,
} from '@expensesreport/ui';
import { AuthService } from '@expensesreport/services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RecoveryPassComponent } from './recovery-pass/recovery-pass.component';

@Component({
  selector: 'expensesreport-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageComponent,
    PageContentComponent,
    TitleComponent,
    InputTextComponent,
    InputPasswordComponent,
    FormGroupComponent,
    DividerComponent,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    ToastComponent,
    RecoveryPassComponent,
  ],
  providers: [MessageService],
})
export class LoginPageComponent implements OnInit {
  loading = false;
  disabled = false;
  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });
  emailErrors = {
    email: 'Email is invalid',
  };
  recoveryPass = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.loginFormGroup.patchValue({
        email,
        rememberMe: true,
      });

      this.loginFormGroup.controls.email.markAsTouched();
      this.loginFormGroup.controls.email.updateValueAndValidity();
    }

    const session = this.authService.getSession(false);

    if (session) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) {
      Object.keys(this.loginFormGroup.controls).forEach((controlName) => {
        const control = this.loginFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      return;
    }

    const email = this.loginFormGroup.value.email || '';
    const password = this.loginFormGroup.value.password || '';

    this.loading = true;

    this.authService.login(email, password).subscribe(
      (response) => {
        if (this.loginFormGroup.value.rememberMe) {
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('email');
        }

        this.authService.createSession(response.token);
        this.router.navigate(['/']);
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Login',
          detail: 'Login failed - Invalid email or password',
        });
        this.loading = false;
      }
    );
  }

  showRecoveryPass() {
    this.recoveryPass = true;
  }

  closeRecoveryPass() {
    this.recoveryPass = false;
  }

  emailSent(event: boolean) {
    if (event) {
      this.messageService.add({
        severity: 'success',
        summary: 'Recovery password',
        detail: 'Recovery password email sent',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Recovery password',
        detail: 'Error sending recovery password email',
      });
    }
  }
}
