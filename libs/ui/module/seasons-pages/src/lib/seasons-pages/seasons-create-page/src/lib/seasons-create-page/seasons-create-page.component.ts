import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  FormGroupComponent,
  InputTextComponent,
  LabelComponent,
  PageContentComponent,
  TextAreaComponent,
} from '@expensesreport/ui';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SeasonService, ToastService } from '@expensesreport/services';
import { Season } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-seasons-create-page',
  standalone: true,
  templateUrl: './seasons-create-page.component.html',
  styleUrl: './seasons-create-page.component.css',
  imports: [
    CommonModule,
    PageContentComponent,
    InputTextComponent,
    FormGroupComponent,
    LabelComponent,
    ButtonComponent,
    TextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SeasonsCreatePageComponent {
  loading = false;
  disabled = false;

  seasonFormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10),
    ]),
  });
  nameErrors = {
    required: 'Name is required',
    minlength: 'Name must be at least 3 characters',
    maxlength: 'Name must be at most 50 characters',
  };
  codeErrors = {
    required: 'Code is required',
    minlength: 'Code must be at least 2 characters',
    maxlength: 'Code must be at most 10 characters',
    exists: 'Code already exists',
  };

  constructor(
    private router: Router,
    private seasonService: SeasonService,
    private toastService: ToastService
  ) {}

  onCodeChange(event: Event) {
    const code = (event.target as HTMLInputElement).value;

    if (this.seasonFormGroup.controls.code.invalid) {
      this.seasonFormGroup.controls.code.markAllAsTouched();
      this.seasonFormGroup.controls.code.updateValueAndValidity();

      return;
    }

    if (code && code !== '') {
      this.seasonService.checkIfCodeExists(code).subscribe(
        (response) => {
          if (response) {
            this.seasonFormGroup.controls.code.setErrors({
              exists: true,
            });
          }
        },
        () => {
          this.toastService.showError('Error checking code');
        }
      );
    }
  }

  onBack() {
    this.router.navigate(['/seasons']);
  }

  onSubmit() {
    if (this.seasonFormGroup.invalid) {
      this.seasonFormGroup.markAllAsTouched();
      this.seasonFormGroup.controls.name.updateValueAndValidity();

      return;
    }

    this.loading = true;

    const newSeason: Season = {
      name: this.seasonFormGroup.controls.name.value as string,
      code: this.seasonFormGroup.controls.code.value as string,
    };

    this.seasonService.create(newSeason).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Season created');
        this.router.navigate(['/seasons']);
      },
      () => {
        this.toastService.showError('Error creating season');
        this.loading = false;
      }
    );
  }
}
