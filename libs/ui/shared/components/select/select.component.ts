import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'expensesreport-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  imports: [CommonModule, DropdownModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() formControl = new FormControl('');
  @Input() useError = false;
  @Input() options: any[] = [];
  @Input() selectedValue: string | null = null;
  @Input() errors: any = null;

  ngOnInit() {
    if (this.errors) {
      this.allErrors = { ...this.allErrors, ...this.errors };
    }

    if (this.selectedValue) {
      const option = this.options.find(
        (option) => option.value === this.selectedValue
      );

      if (option) {
        this.value = option;
        this.onChange(option);
      }

      if (this.formControl.value) {
        this.checkErrors();
      }
    }

    this.formControl.statusChanges.subscribe(() => {
      if (this.formControl.errors && this.formControl.touched) {
        this.checkErrors();
      }
    });
  }

  value: {
    label: string;
    value: string;
  } | null = null;

  onChange: any = () => {};
  onTouch: any = () => {};

  errorMessage = '';
  allErrors = {
    required: 'Required',
  };

  writeValue(value: any): void {
    if (value) {
      const option = this.options.find((option) => option.value === value);

      if (option) {
        this.value = option;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onSelectionChange(event: any) {
    if (event.value === null) {
      this.value = null;
      this.onChange(null);
      this.onTouch();
      return;
    }

    this.value = {
      label: event.value.label,
      value: event.value.value,
    };
    this.onChange(event.value.value);
    this.onTouch();
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
