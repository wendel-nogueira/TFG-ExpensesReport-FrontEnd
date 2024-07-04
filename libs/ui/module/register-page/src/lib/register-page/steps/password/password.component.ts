import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  PasswordComponent as PasswordComponentModule,
} from '@expensesreport/ui';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterServiceService } from '../../services/register-service.service';
import { Password, TokenData, User } from '@expensesreport/models';
import {
  AuthService,
  ToastService,
  UserService,
} from '@expensesreport/services';

@Component({
  selector: 'expensesreport-password-step',
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  imports: [CommonModule, PasswordComponentModule, ButtonComponent],
})
export class PasswordComponent implements OnInit {
  password: Password | null = null;
  passwordFormGroup = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    public registerService: RegisterServiceService
  ) {}

  ngOnInit() {
    this.password = this.registerService.register.password;
  }

  onSubmit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];

      if (!token) {
        this.toastService.showError('Invalid token, request a new one');
        this.router.navigate(['login']);
        return;
      }

      const tokenData = this.authService.decodeToken(token);
      const tokenInvalid = this.authService.isExpired(token);

      if (!tokenData || tokenInvalid) {
        this.toastService.showError('Invalid token, request a new one');
        this.router.navigate(['login']);
        return;
      }

      this.createPassword(tokenData, token);
    });
  }

  createPassword(tokenData: TokenData, token: string) {
    if (this.passwordFormGroup.invalid) {
      this.passwordFormGroup.setErrors({
        invalid: true,
      });

      this.toastService.showError('Invalid form, please check the fields');

      return;
    }

    this.registerService.register.password = {
      password: this.passwordFormGroup.value.password || '',
      confirmPassword: this.passwordFormGroup.value.confirmPassword || '',
    };

    const user: {
      email: string;
      password: string;
      confirmPassword: string;
    } & User = {
      identityId: tokenData.nameid,
      firstName: this.registerService.register.name.firstName,
      lastName: this.registerService.register.name.lastName,
      address: this.registerService.register.address.address,
      city: this.registerService.register.address.city,
      state: this.registerService.register.address.state,
      country: this.registerService.register.address.country,
      zip: this.registerService.register.address.zip,
      email: tokenData.email,
      password: this.passwordFormGroup.value.password || '',
      confirmPassword: this.passwordFormGroup.value.confirmPassword || '',
    };

    this.loading = true;

    this.userService.create(user, token).subscribe(
      () => {
        this.toastService.showSuccess('User created successfully');
        this.loading = false;

        this.router.navigate(['login']);
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.toastService.showError('Error creating user, please try again');
      }
    );
  }

  previousPage() {
    this.registerService.register.password = {
      password: this.passwordFormGroup.value.password || '',
      confirmPassword: this.passwordFormGroup.value.confirmPassword || '',
    };

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        this.router.navigate(['register/address'], {
          queryParams: { token: token },
        });
      }
    });
  }
}
