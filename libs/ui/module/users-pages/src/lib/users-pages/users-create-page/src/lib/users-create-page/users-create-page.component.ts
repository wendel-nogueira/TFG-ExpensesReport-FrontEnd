import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContentComponent,
  InputTextComponent,
  SelectComponent,
  FormGroupComponent,
  LabelComponent,
  ButtonComponent,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthService,
  DialogService,
  IdentityService,
  ToastService,
} from '@expensesreport/services';
import { UserRoles } from '@expensesreport/enums';
import { Identity } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-users-create-page',
  standalone: true,
  templateUrl: './users-create-page.component.html',
  styleUrl: './users-create-page.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    SelectComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsersCreatePageComponent implements OnInit {
  loading = false;
  disabled = false;
  roles: Role[] = [];

  isRoot = false;

  userFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
  });
  emailErrors = {
    email: 'Email is invalid',
    emailExists: 'Email already exists',
  };

  constructor(
    private router: Router,
    private identityService: IdentityService,
    private authService: AuthService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    const data = this.authService.getSessionData();

    if (data) {
      this.isRoot = data.role === 'Accountant' || data.role === 'Admin';
    }

    const roles = Object.keys(UserRoles).filter(
      (key) => !isNaN(Number(UserRoles[key as keyof typeof UserRoles]))
    );

    this.roles = roles.map((role) => {
      return {
        label: role,
        value: UserRoles[role as keyof typeof UserRoles].toString(),
      };
    });

    if (!this.isRoot) {
      this.roles = this.roles.filter((role) => role.value === '1');
      this.userFormGroup.controls.role.setValue('1');
    }
  }

  onEmailChange(event: Event) {
    const email = (event.target as HTMLInputElement).value;

    if (this.userFormGroup.controls.email.invalid) {
      this.userFormGroup.controls.email.markAllAsTouched();
      this.userFormGroup.controls.email.updateValueAndValidity();

      return;
    }

    if (email && email !== '') {
      this.identityService.checkIfEmailExists(email).subscribe(
        (response) => {
          if (response) {
            this.userFormGroup.controls.email.setErrors({ emailExists: true });
          }
        },
        () => {
          this.toastService.showError('Error checking email');
        }
      );
    }
  }

  onSubmit() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.controls.email.markAllAsTouched();
      this.userFormGroup.controls.role.markAllAsTouched();
      this.userFormGroup.controls.role.updateValueAndValidity();

      this.toastService.showError('Invalid form');
      return;
    }

    this.dialogService.confirm(
      'Create User',
      'Are you sure you want to create this user?',
      () => {
        this.create();
      },
      () => undefined
    );
  }

  create() {
    this.loading = true;
    this.disabled = true;

    const email = this.userFormGroup.controls.email.value as string;
    const role = parseInt(this.userFormGroup.controls.role.value as string);

    const newUser: Identity = {
      username: email.split('@')[0],
      email: email,
      role: role,
    };

    this.identityService.create(newUser).subscribe(
      () => {
        this.toastService.showSuccess('User created');
        this.router.navigate(['/users']);
      },
      () => {
        this.toastService.showError('Error creating user');
        this.loading = false;
        this.disabled = false;
      }
    );
  }

  onBack() {
    this.router.navigate(['/users']);
  }
}

interface Role {
  label: string;
  value: string;
}
