import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'expensesreport-input-password',
  standalone: true,
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.css',
  imports: [InputTextModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputPasswordComponent,
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() formControl = new FormControl('');

  value: string | null = null;
  onChange: any = () => {};
  onTouch: any = () => {};

  showPassword = false;

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
