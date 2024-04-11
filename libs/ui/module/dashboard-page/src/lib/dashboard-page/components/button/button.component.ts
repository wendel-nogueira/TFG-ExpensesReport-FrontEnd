import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import {
  ArrowDownComponent,
  CalendarComponent,
  ReloadComponent,
} from '@expensesreport/icons';

@Component({
  selector: 'expensesreport-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  imports: [
    CommonModule,
    ArrowDownComponent,
    CalendarComponent,
    ReloadComponent,
  ],
})
export class ButtonComponent {
  @Input() type = '';
  @Input() label = '';
  @Output() buttonClick: EventEmitter<Event> = new EventEmitter(false);
}
