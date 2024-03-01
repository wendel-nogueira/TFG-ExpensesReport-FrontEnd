import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroupComponent,
  InputTextComponent,
  LabelComponent,
} from '../../index';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Name } from '../../../../core/models/Name';

@Component({
  selector: 'expensesreport-personal',
  standalone: true,
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormGroupComponent,
    InputTextComponent,
    LabelComponent,
  ],
})
export class PersonalComponent implements OnInit {
  @Input() name: Name | null = null;
  @Output() personalFormGroup = new EventEmitter<FormGroup>();

  personalFormGroupLocal = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
  });

  firstNameErrors = {
    minlength: 'First Name must be at least 3 characters long',
    maxlength: 'First Name must be at most 50 characters long',
  };

  lastNameErrors = {
    minlength: 'Last Name must be at least 3 characters long',
    maxlength: 'Last Name must be at most 50 characters long',
  };

  ngOnInit() {
    if (this.name) {
      this.personalFormGroupLocal.patchValue(this.name);
    }

    this.personalFormGroupLocal.statusChanges.subscribe(() => {
      if (this.personalFormGroupLocal.errors) {
        this.personalFormGroupLocal.setErrors(null);

        Object.keys(this.personalFormGroupLocal.controls).forEach(
          (controlName) => {
            const control = this.personalFormGroupLocal.get(controlName);

            if (control) {
              control.markAsTouched();
              control.updateValueAndValidity();
            }
          }
        );

        return;
      }
    });

    this.personalFormGroup.emit(this.personalFormGroupLocal);
  }
}
