import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { PageComponent } from '../../components/page/page.component';
import {
  PersonalComponent,
  AddressComponent,
  ButtonComponent,
  DividerComponent,
} from '@expensesreport/ui';
import { Address, Name } from '@expensesreport/models';
import { FormControl, FormGroup } from '@angular/forms';

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
export class AccountComponent {
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

  onSubmit() {
    if (this.personalFormGroup.invalid || this.addressFormGroup.invalid) {
      this.personalFormGroup.setErrors({
        invalid: true,
      });

      this.addressFormGroup.setErrors({
        invalid: true,
      });

      console.log(this.personalFormGroup.errors, this.addressFormGroup.errors);

      return;
    }

    console.log(this.personalFormGroup.value, this.addressFormGroup.value);

    this.loading = true;
  }
}
