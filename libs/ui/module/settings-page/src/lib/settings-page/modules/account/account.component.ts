import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { PageComponent } from '../../components/page/page.component';
import {
  PersonalComponent,
  AddressComponent,
  ButtonComponent,
  DividerComponent,
} from '@expensesreport/ui';
import { Address, Name, User } from '@expensesreport/models';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DialogService,
  ToastService,
  UserService,
} from '@expensesreport/services';

@Component({
  selector: 'expensesreport-account',
  standalone: true,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  imports: [
    CommonModule,
    ContainerComponent,
    PageComponent,
    PersonalComponent,
    AddressComponent,
    ButtonComponent,
    DividerComponent,
  ],
})
export class AccountComponent implements OnInit {
  user: User | null = null;

  name: Name | null = null;
  personalFormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  address: Address | null = null;
  addressFormGroup = new FormGroup({
    zip: new FormControl(''),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
  });

  loading = false;
  disabled = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.loading = true;

    this.userService.getMe().subscribe(
      (info) => {
        this.personalFormGroup.setValue({
          firstName: info.firstName,
          lastName: info.lastName,
        });

        this.addressFormGroup.setValue({
          zip: info.zip,
          country: info.country,
          state: info.state,
          city: info.city,
          address: info.address,
        });

        this.user = info;
        this.loading = false;
      },
      () => {
        this.toastService.showError('Error loading user information');
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.personalFormGroup.invalid || this.addressFormGroup.invalid) {
      this.toastService.showError('Invalid form');
      return;
    }

    this.dialogService.confirm(
      'Update user',
      'Are you sure you want to update your information?',
      () => this.updateUser(),
      () => undefined
    );
  }

  updateUser() {
    if (!this.user) {
      this.toastService.showError('User not found');
      return;
    }

    this.loading = true;

    const userToUpdate: User = {
      ...this.user,
      firstName:
        this.personalFormGroup.get('firstName')?.value || this.user.firstName,
      lastName:
        this.personalFormGroup.get('lastName')?.value || this.user.lastName,
      address: this.addressFormGroup.get('address')?.value || this.user.address,
      city: this.addressFormGroup.get('city')?.value || this.user.city,
      state: this.addressFormGroup.get('state')?.value || this.user.state,
      zip: this.addressFormGroup.get('zip')?.value || this.user.zip,
      country: this.addressFormGroup.get('country')?.value || this.user.country,
    };

    this.userService.update(userToUpdate).subscribe(
      () => {
        this.toastService.showSuccess('User updated successfully');
        this.loading = false;
      },
      () => {
        this.toastService.showError('Error updating user');
        this.loading = false;
      }
    );
  }
}
