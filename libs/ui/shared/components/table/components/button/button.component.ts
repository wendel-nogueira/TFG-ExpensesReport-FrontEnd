import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FilterComponent,
  SortComponent,
  ExportComponent,
} from '../../../icons/index';

@Component({
  selector: 'expensesreport-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  imports: [CommonModule, FilterComponent, SortComponent, ExportComponent],
})
export class ButtonComponent {
  @Input() type: string = '';
  @Output() onClick: EventEmitter<any> = new EventEmitter();
}
