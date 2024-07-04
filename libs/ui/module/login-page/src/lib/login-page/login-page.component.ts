import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environments } from '@expensesreport/environments';
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
} from '@expensesreport/ui';
import { AuthService, UserService } from '@expensesreport/services';
import { Router } from '@angular/router';
import { RecoveryPassComponent } from './recovery-pass/recovery-pass.component';
import { CredentialResponse } from 'google-one-tap';
import { ToastService } from '@expensesreport/services';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'expensesreport-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [
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
    RecoveryPassComponent,
    RegisterComponent,
  ],
  providers: [],
})
export class LoginPageComponent implements OnInit, AfterViewInit {
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
  createAccount = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.loginFormGroup.patchValue({
        email,
        rememberMe: true,
      });
    }
  }

  ngAfterViewInit() {
    window.google.accounts.id.initialize({
      log_level: environments.production ? 'warn' : 'debug',
      client_id: environments.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    const button = document.getElementById('loginWithGoogle');

    if (!button) {
      return;
    }

    window.google.accounts.id.renderButton(button, {
      theme: 'filled_blue',
      locale: 'en',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      type: 'standard',
      logo_alignment: 'left',
      width: 240,
    });
  }

  handleCredentialResponse(response: CredentialResponse): void {
    if (!response.credential) {
      this.toastService.showError('Error logging in with Google');
      return;
    }

    this.loginWithGoogle(response.credential);
  }

  loginWithGoogle(token: string): void {
    this.authService.loginWithGoogle(token).subscribe(
      (response) => {
        if (response.refreshToken === null || response.token === null)
          throw new Error('Invalid response');

        this.toastService.showSuccess('Login success!');

        this.authService.createSession(response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error:', error);

        if (error.code && error.code === 400)
          this.toastService.showError('Invalid email or password');
        else this.toastService.showError('Error logging in, try again!');
      }
    );
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

        if (response.refreshToken === null || response.token === null)
          throw new Error('Invalid response');

        this.authService.createSession(response);

        this.userService.getUserByIdentity(response.userId).subscribe(
          (user) => {
            localStorage.setItem('user', JSON.stringify(user));

            console.log('User:', user);

            this.toastService.showSuccess('Login success!');
            this.router.navigate(['/']);
            this.loading = false;
          },
          (error) => {
            console.error('Error:', error);

            this.toastService.showError('Error logging in, try again!');

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            this.loading = false;
          }
        );
      },
      (error) => {
        console.error('Error:', error);

        if (error.code && error.code === 400)
          this.toastService.showError('Invalid email or password');
        else this.toastService.showError('Error logging in, try again!');

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

  showCreateAccount() {
    this.createAccount = true;
  }

  closeCreateAccount() {
    this.createAccount = false;
  }
}
