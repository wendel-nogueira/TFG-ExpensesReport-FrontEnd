import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
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
import { AddressService } from '@expensesreport/services';

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
export class AddressComponent implements OnInit, OnChanges {
  @Input() address: Address | null = null;
  @Input() disabled = false;
  @Input() loading = false;
  @Output() addressFormGroup = new EventEmitter<FormGroup>();

  countries = countries;
  loadingCountries = false;
  states: SelectOption[] = [];
  loadingStates = false;
  cities: SelectOption[] = [];
  loadingCities = false;
  loadingAddress = false;

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

  constructor(private addressService: AddressService) {}

  ngOnChanges(changes: any) {
    if (changes.disabled) {
      if (this.disabled) {
        this.addressFormGroupLocal.disable();
      } else {
        this.addressFormGroupLocal.enable();
      }
    }
  }

  ngOnInit() {
    if (this.address) {
      this.addressFormGroupLocal.patchValue(this.address);
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

    this.addressFormGroupLocal.controls.country.valueChanges.subscribe(
      (value) => {
        const country = this.countries.find(
          (country) => country.value === value || country.label === value
        );
        const state =
          this.addressFormGroupLocal.controls.state.value || undefined;
        const city =
          this.addressFormGroupLocal.controls.city.value || undefined;

        if (country) {
          this.onCountryChange(country, state, city);
        }
      }
    );
  }

  onCountryChange(
    event: { label: string; value: string },
    stateName?: string,
    cityName?: string
  ) {
    this.loadingStates = true;
    this.loadingCities = true;

    this.states = [];
    this.cities = [];

    this.addressFormGroupLocal.get('state')?.setValue(null);
    this.addressFormGroupLocal.get('city')?.setValue(null);

    if (!event || !event.label) {
      this.loadingStates = false;
      this.loadingCities = false;
      return;
    }

    const country = event.label;

    this.addressService.getStates(country).subscribe(
      (response) => {
        if (!response.error) {
          this.states = response.data.states.map((state) => ({
            label: state.name,
            value: state.state_code,
          }));

          let state = null;

          if (stateName) {
            state = this.states.find(
              (state) => state.label === stateName || state.value === stateName
            );
          } else if (this.addressFormGroupLocal.controls.state.value) {
            state = this.states.find(
              (state) =>
                state.label ===
                  this.addressFormGroupLocal.controls.state.value ||
                state.value === this.addressFormGroupLocal.controls.state.value
            );
          }

          if (!cityName && this.addressFormGroupLocal.controls.city.value) {
            cityName = this.addressFormGroupLocal.controls.city.value;
          } else {
            this.loadingCities = false;
          }

          if (state) {
            this.addressFormGroupLocal.get('state')?.setValue(state.value);
            this.onStateChange(state, cityName);
          }
        } else {
          console.error('Error getting states:', response);
        }

        this.loadingStates = false;
      },
      (error) => {
        console.error('Error getting states:', error);

        this.loadingStates = false;
        this.loadingCities = false;
      }
    );
  }

  onStateChange(event: any, cityName?: string) {
    this.loadingCities = true;

    this.cities = [];
    this.addressFormGroupLocal.get('city')?.setValue(null);

    const country = this.countries.find(
      (country) =>
        country.value === this.addressFormGroupLocal.get('country')?.value ||
        country.label === this.addressFormGroupLocal.get('country')?.value
    )?.label;

    if (!event || !event.label || !country) {
      this.loadingCities = false;
      return;
    }

    const state = event.label;

    this.addressService.getCities(country, state).subscribe(
      (response) => {
        if (!response.error) {
          this.cities = response.data.map((city) => ({
            label: city,
            value: city,
          }));

          let city = null;

          if (cityName) {
            city = this.cities.find(
              (city) => city.label === cityName || city.value === cityName
            );
          } else if (this.addressFormGroupLocal.controls.city.value) {
            city = this.cities.find(
              (city) =>
                city.label === this.addressFormGroupLocal.controls.city.value ||
                city.value === this.addressFormGroupLocal.controls.city.value
            );
          }

          if (city) {
            this.addressFormGroupLocal.get('city')?.setValue(city.value);
          }
        } else {
          console.error('Error getting cities:', response);
        }

        this.loadingCities = false;
      },
      (error) => {
        console.error('Error getting cities:', error);

        this.loadingCities = false;
      }
    );
  }

  onZipChange(value: any) {
    if (!value || value === '') return;

    this.loadingCountries = true;
    this.loadingStates = true;
    this.loadingCities = true;
    this.loadingAddress = true;

    this.addressFormGroupLocal.get('country')?.setValue(null);
    this.addressFormGroupLocal.get('state')?.setValue(null);
    this.addressFormGroupLocal.get('city')?.setValue(null);

    this.addressService.getInfoByZip(value).subscribe(
      (response) => {
        if (
          response.results &&
          response.results[value] &&
          response.results[value].length > 0
        ) {
          const zipInfo = response.results[value][0];
          const country = this.countries.find(
            (country) => country.value === zipInfo.country_code
          );

          if (country) {
            this.addressFormGroupLocal.get('country')?.setValue(country.value);
            this.addressFormGroupLocal.get('state')?.setValue(zipInfo.state);
            this.addressFormGroupLocal.get('city')?.setValue(zipInfo.city);
            this.addressFormGroupLocal.get('address')?.setValue(zipInfo.city);

            this.onCountryChange(country, zipInfo.state_en, zipInfo.province);

            this.loadingCountries = false;
            this.loadingAddress = false;
          }
        } else {
          console.error('Error getting zip info:', response);

          this.loadingCountries = false;
          this.loadingStates = false;
          this.loadingCities = false;
          this.loadingAddress = false;
        }
      },
      (error) => {
        console.error('Error getting zip info:', error);

        this.loadingCountries = false;
        this.loadingStates = false;
        this.loadingCities = false;
        this.loadingAddress = false;
      }
    );
  }
}

interface SelectOption {
  label: string;
  value: string;
}
