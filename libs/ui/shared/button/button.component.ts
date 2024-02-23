import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
} from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'expensesreport-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  imports: [CommonModule, ProgressSpinnerModule],
})
export class ButtonComponent implements OnChanges {
  @Input() label = '';
  @Input() type = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() color = 'primary' as keyof typeof ButtonComponent.prototype.styles;

  @Output() onClick = new EventEmitter<void>();

  styles = {
    primary: `${defaultStyle} hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white`,
    primary_loading: `${defaultStyle} bg-blue-500 dark:bg-blue-500`,
    danger: `${defaultStyle} hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white`,
    danger_loading: `${defaultStyle} bg-red-500 dark:bg-red-500`,
    success: `${defaultStyle} hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white`,
    success_loading: `${defaultStyle} bg-green-500 dark:bg-green-500`,
    warning: `${defaultStyle} hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white`,
    warning_loading: `${defaultStyle} bg-orange-500 dark:bg-orange-500`,
    info: `${defaultStyle} hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white`,
    info_loading: `${defaultStyle} bg-blue-500 dark:bg-blue-500`,
    other: `${defaultStyle} hover:bg-gray-100 dark:hover:bg-gray-600`,
    other_loading: `${defaultStyle} bg-gray-400 dark:hover:bg-gray-600`,
    disabled: `${defaultStyle} bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed pointer-events-none`,
  };
  style = this.styles[this.color];

  onClickButton(): void {
    this.onClick.emit();
  }

  ngOnChanges(changes: {
    loading: SimpleChange;
    color: SimpleChange;
    disabled: SimpleChange;
  }): void {
    if (changes.disabled) {
      this.style = this.disabled
        ? this.styles.disabled
        : this.styles[this.color];
    } else if (changes.loading) {
      this.style = this.loading
        ? this.styles[`${this.color}_loading` as keyof typeof this.styles]
        : this.styles[this.color];
    } else if (changes.color) {
      this.style = this.styles[this.color];
    }
  }
}

const defaultStyle =
  'flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 px-3 py-2.5 rounded-lg w-full transition-colors duration-300 hover:border-transparent';
