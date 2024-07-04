import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
} from '@angular/core';
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
  UserService,
} from '@expensesreport/services';
import { UserRoles, UserStatus } from '@expensesreport/enums';
import { Identity, User } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
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
export class EditComponent implements OnInit, OnChanges {
  @Input() id: string | null = null;
  @Input() user: User | null = null;
  @Input() loading = false;

  loadingState = false;
  disabled = false;
  isDeleted = false;
  roles: Role[] = [];

  userFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
  });
  emailErrors = {
    email: 'Email is invalid',
    exists: 'Email already exists',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private identityService: IdentityService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    const roles = Object.keys(UserRoles).filter(
      (key) => !isNaN(Number(UserRoles[key as keyof typeof UserRoles]))
    );

    this.roles = roles.map((role) => {
      return {
        label: role,
        value: UserRoles[role as keyof typeof UserRoles].toString(),
      };
    });

    this.userFormGroup.controls.email.disable();
  }

  ngOnChanges(changes: { id: SimpleChange; user: SimpleChange }) {
    if (changes.id)
      this.id = changes.id.currentValue ? changes.id.currentValue : null;

    if (changes.user) {
      this.user = changes.user.currentValue ? changes.user.currentValue : null;

      if (this.user) {
        this.userFormGroup.patchValue({
          email: this.user.identity?.email,
          role: this.user.identity?.role.toString(),
        });

        this.isDeleted = this.user.identity?.status === UserStatus.Deleted;
      }
    }
  }

  onSubmit() {
    if (this.userFormGroup.invalid) {
      Object.keys(this.userFormGroup.controls).forEach((controlName) => {
        const control = this.userFormGroup.get(controlName);

        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });

      return;
    }

    if (!this.user) {
      this.toastService.showError('User not found');
      return;
    }

    this.dialogService.confirm(
      'Are you sure you want to update this user?',
      'Update User',
      () => {
        this.updateUser();
      },
      () => undefined
    );
  }

  updateUser() {
    if (!this.user) return;

    this.loading = true;

    const identityToUpdate: Identity = {
      ...this.user.identity,
      email: this.userFormGroup.get('email')?.value as string,
      role: Number(this.userFormGroup.get('role')?.value),
    };

    this.identityService.update(identityToUpdate).subscribe(
      () => {
        this.toastService.showSuccess('User updated');
        this.loading = false;
      },
      (error) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onChangeStatus() {
    if (!this.user) {
      this.toastService.showError('User not found');
      return;
    }

    const status = this.user.identity?.status;

    this.dialogService.confirm(
      `${status === UserStatus.Active ? 'Delete' : 'Restore'} User`,
      `Are you sure you want to ${
        status === UserStatus.Active ? 'delete' : 'restore'
      } this user?`,
      () => {
        this.changeStatus(
          status === UserStatus.Active ? UserStatus.Deleted : UserStatus.Active
        );
      },
      () => undefined
    );
  }

  changeStatus(userStatus: UserStatus) {
    if (!this.user) return;

    this.loadingState = true;

    this.identityService
      .updateStatus(this.user.identity?.id as string, userStatus)
      .subscribe(
        (user) => {
          this.toastService.showSuccess(
            `User ${userStatus === UserStatus.Active ? 'restored' : 'deleted'}`
          );

          if (this.user && this.user.identity) {
            this.user = {
              ...this.user,
              identity: {
                ...this.user.identity,
                status: user.status,
              },
            };

            this.isDeleted = user.status === UserStatus.Deleted;
          }

          this.loadingState = false;
        },
        (error) => {
          this.toastService.showError(error);
          this.loadingState = false;
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
