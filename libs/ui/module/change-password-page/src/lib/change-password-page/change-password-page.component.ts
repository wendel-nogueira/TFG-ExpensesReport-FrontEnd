import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  PageComponent,
  PageContentComponent,
  TitleComponent,
  ButtonComponent,
  ToastComponent,
} from '@expensesreport/ui';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from '@expensesreport/ui';
import { MessageService } from 'primeng/api';
import {
  AuthService,
  IdentityService,
  ToastService,
} from '@expensesreport/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Identity } from '@expensesreport/models';
import { UserStatus } from '@expensesreport/enums';

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
    ToastComponent,
  ],
  providers: [MessageService],
})
export class ChangePasswordPageComponent implements OnInit {
  token: string | null = null;
  key: string | null = null;

  identity: Identity | null = null;

  loading = false;
  checkingToken = false;
  tokenValid = true;
  disabled = false;

  changePasswordFormGroup = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private identityService: IdentityService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];
      const key = params['key'];

      if (!token || !key) {
        this.router.navigate(['login']);
        return;
      }

      const tokenDecoded = this.authService.decodeToken(token);
      const tokenInvalid = this.authService.isExpired(token);

      if (!tokenDecoded || tokenInvalid) {
        this.toastService.showError('Invalid token, request a new one');
        this.router.navigate(['login']);
        return;
      }

      this.token = token;
      this.key = key;

      this.identityService
        .checkIfResetPasswordTokenIsValid(key, token)
        .subscribe(
          (valid) => {
            if (!valid) {
              this.toastService.showError('Invalid token, request a new one');
              this.router.navigate(['login']);
              return;
            }

            this.tokenValid = true;

            this.identityService.getMe(token).subscribe(
              (user) => {
                this.identity = user;
                this.loading = false;

                if (user.status !== UserStatus.Active) {
                  this.toastService.showError('Invalid token, request a new one');
                  this.router.navigate(['login']);
                  return;
                }
              },
              () => {
                this.toastService.showError('Invalid token, request a new one');
                this.router.navigate(['login']);
              }
            );
          },
          () => {
            this.toastService.showError('Invalid token, request a new one');
            this.router.navigate(['login']);
          }
        );
    });
  }

  onSubmit() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.setErrors({
        invalid: true,
      });

      return;
    }

    if (!this.token || !this.key) {
      this.toastService.showError('Invalid token, request a new one');
      this.router.navigate(['login']);
      return;
    }

    const password = this.changePasswordFormGroup.get('password')?.value;
    const confirmPassword = this.changePasswordFormGroup.get('confirmPassword')?.value;

    if ((!password || !confirmPassword) || (password !== confirmPassword)) {
      this.toastService.showError('Passwords do not match');
      this.loading = false;
      return;
    }

    this.loading = true;

    const data = {
      resetToken: this.key,
      newPassword: password,
      confirmPassword: confirmPassword,
    };

    this.identityService.updatePassword(data, this.token).subscribe(
      () => {
        this.toastService.showSuccess('Password updated successfully');
        this.router.navigate(['login']);
      },
      () => {
        this.toastService.showError('An error occurred, please try again');
        this.loading = false;
      }
    );
  }
}
