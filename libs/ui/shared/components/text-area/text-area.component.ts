import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'expensesreport-text-area',
  standalone: true,
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    SkeletonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextAreaComponent,
      multi: true,
    },
  ],
})
export class TextAreaComponent implements ControlValueAccessor, OnInit {
  @Input() id = '';
  @Input() formControl = new FormControl('');
  @Input() useError = false;
  @Input() errors: any = null;
  @Input() loading = false;

  value: string | null = null;
  onChange: any = () => {};
  onTouch: any = () => {};

  errorMessage = '';
  allErrors = {
    required: 'Required',
  };

  ngOnInit() {
    if (this.errors) {
      this.allErrors = { ...this.allErrors, ...this.errors };
    }

    if (this.formControl.value) {
      this.checkErrors();
    }

    this.formControl.statusChanges.subscribe(() => {
      if (this.formControl.errors && this.formControl.touched) {
        this.checkErrors();
      }
    });
  }

  writeValue(value: string): void {
    if (value) this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  checkErrors() {
    const errors = this.formControl.errors as any;

    if (errors) {
      const keys = Object.keys(errors);

      if (keys.length > 0) {
        this.errorMessage =
          this.allErrors[keys[0] as keyof typeof this.allErrors];
      } else {
        this.errorMessage = '';
      }
    }
  }
}
