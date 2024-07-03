import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AddComponent,
  FilterComponent,
  SortComponent,
  ExportComponent,
  DeleteComponent,
} from '../../../icons/index';

@Component({
  selector: 'expensesreport-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  imports: [
    CommonModule,
    AddComponent,
    FilterComponent,
    SortComponent,
    ExportComponent,
    DeleteComponent,
  ],
})
export class ButtonComponent {
  @Input() type: string = '';
  @Input() loading = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
}
