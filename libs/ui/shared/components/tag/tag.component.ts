import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'expensesreport-tag',
  standalone: true,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
  providers: [CommonModule],
})
export class TagComponent implements OnInit {
  @Input() text = '';

  class = '';
  classes = {
    'blue': [
      'paid',
      'fieldstaff',
      'asset',
    ],
    'green': [
      'approvedbysupervisor',
      'active',
      'manager',
      'approved',
    ],
    'red': [
      'rejectedbysupervisor',
      'deactivate',
      'rejected',
    ],
    'orange': [
      'submitted',
    ],
    'purple': [
      'paymentrejected',
      'accountant',
      'expense',
    ],
  }

  ngOnInit(): void {
    this.class = this.getClass();
  }

  getClass(): string {
    for (const key in this.classes) {
      if (this.classes[key as keyof typeof this.classes].includes(this.text)) {
        return key;
      }
    }
    return '';
  }
}
