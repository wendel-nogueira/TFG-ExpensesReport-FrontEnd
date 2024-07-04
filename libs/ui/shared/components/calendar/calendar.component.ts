import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'expensesreport-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, SkeletonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CalendarComponent,
      multi: true,
    },
  ],
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  @Input() id = '';
  @Input() type = 'text';
  @Input() loading = false;
  @Input() formControl = new FormControl('');
  @Input() useError = false;
  @Input() errors: any = null;
  @Output() valueChange = new EventEmitter<any>();

  date: Date | null = null;
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
      if (this.formControl.errors) {
        this.checkErrors();
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: Date): void {
    this.date = value;
  }

  onDateSelect(event: any) {
    this.date = event;
    this.onChange(this.date);
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
