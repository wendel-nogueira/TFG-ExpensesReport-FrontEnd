import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroupComponent,
  InputTextComponent,
  LabelComponent,
  SelectComponent,
} from '../../index';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { countries } from './contants/countries';
import { Address } from '../../../../core/models/Address';

@Component({
  selector: 'expensesreport-address',
  standalone: true,
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormGroupComponent,
    InputTextComponent,
    LabelComponent,
    SelectComponent,
  ],
})
export class AddressComponent implements OnInit {
  @Input() address: Address | null = null;
  @Output() addressFormGroup = new EventEmitter<FormGroup>();

  countries = countries;
  country: string | null = null;
  states = [
    {
      label: 'state 1',
      value: 'state 1',
    },
    {
      label: 'state 2',
      value: 'state 2',
    },
    {
      label: 'state 3',
      value: 'state 3',
    },
  ];
  state: string | null = null;
  cities = [
    {
      label: 'city 1',
      value: 'city 1',
    },
    {
      label: 'city 2',
      value: 'city 2',
    },
    {
      label: 'city 3',
      value: 'city 3',
    },
  ];
  city: string | null = null;
  addressFormGroupLocal = new FormGroup({
    zip: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(10),
    ]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
    ]),
  });
  zipErrors = {
    minlength: 'Zip must be at least 5 characters long',
    maxlength: 'Zip must be at most 10 characters long',
  };
  addressErrors = {
    minlength: 'Address must be at least 5 characters long',
    maxlength: 'Address must be at most 50 characters long',
  };

  ngOnInit() {
    if (this.address) {
      this.addressFormGroupLocal.patchValue(this.address);

      this.country = this.address.country;
      this.state = this.address.state;
      this.city = this.address.city;
    }

    this.addressFormGroupLocal.statusChanges.subscribe(() => {
      if (this.addressFormGroupLocal.errors) {
        this.addressFormGroupLocal.setErrors(null);

        Object.keys(this.addressFormGroupLocal.controls).forEach(
          (controlName) => {
            const control = this.addressFormGroupLocal.get(controlName);

            if (control) {
              control.markAsTouched();
              control.updateValueAndValidity();
            }
          }
        );

        return;
      }
    });

    this.addressFormGroup.emit(this.addressFormGroupLocal);
  }
}
