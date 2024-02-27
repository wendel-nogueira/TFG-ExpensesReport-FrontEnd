import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'expensesreport-input-text',
  standalone: true,
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    KeyFilterModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputTextComponent,
      multi: true,
    },
  ],
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() type = 'text';
  @Input() formControl = new FormControl('');
  @Input() useError = false;

  value: string | null = null;
  onChange: any = () => {};
  onTouch: any = () => {};

  errorMessage = '';
  errors = {
    required: 'Required',
  };

  writeValue(value: string): void {
    this.value = value;
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

  onInput() {
    const errors = this.formControl.errors as any;

    if (errors) {
      const keys = Object.keys(errors);

      if (keys.length > 0) {
        this.errorMessage = this.errors[keys[0] as keyof typeof this.errors];
      } else {
        this.errorMessage = '';
      }
    }
  }
}
