import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressComponent as AddressComponentModule,
  ButtonComponent,
} from '@expensesreport/ui';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterServiceService } from '../../services/register-service.service';
import { Address } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-address-step',
  standalone: true,
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
  imports: [CommonModule, AddressComponentModule, ButtonComponent],
})
export class AddressComponent implements OnInit {
  address: Address | null = null;
  addressFormGroup = new FormGroup({
    zip: new FormControl(''),
    country: new FormControl('US'),
    state: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public registerService: RegisterServiceService
  ) {}

  ngOnInit() {
    this.address = this.registerService.register.address;
  }

  nextPage() {
    if (this.addressFormGroup.invalid) {
      this.addressFormGroup.setErrors({
        invalid: true,
      });

      return;
    }

    this.registerService.register.address = {
      zip: this.addressFormGroup.value.zip || '',
      country: 'US',
      state: this.addressFormGroup.value.state || '',
      city: this.addressFormGroup.value.city || '',
      address: this.addressFormGroup.value.address || '',
    };

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        this.router.navigate(['register/password'], {
          queryParams: { token: token },
        });
      }
    });
  }

  previousPage() {
    this.registerService.register.address = {
      zip: this.addressFormGroup.value.zip || '',
      country: this.addressFormGroup.value.country || '',
      state: this.addressFormGroup.value.state || '',
      city: this.addressFormGroup.value.city || '',
      address: this.addressFormGroup.value.address || '',
    };

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        this.router.navigate(['register/personal'], {
          queryParams: { token: token },
        });
      }
    });
  }
}
