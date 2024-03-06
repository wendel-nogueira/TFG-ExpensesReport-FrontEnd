import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import {
  InfoComponent,
  SuccessComponent,
  ErrorComponent,
  WarningComponent,
} from '../icons/index';

@Component({
  selector: 'expensesreport-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  imports: [
    CommonModule,
    ToastModule,
    InfoComponent,
    SuccessComponent,
    ErrorComponent,
    WarningComponent,
  ],
})
export class ToastComponent {}
