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

@Component({
  selector: 'expensesreport-input-text',
  standalone: true,
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, KeyFilterModule],
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

  value: string | null = null;
  onChange: any = () => {};
  onTouch: any = () => {};

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
}
