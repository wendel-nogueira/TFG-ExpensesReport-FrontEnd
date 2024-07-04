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
    blue: ['fieldstaff', 'supervisor', 'approvedbysupervisor', 'partiallypaid'],
    green: [
      'accountant',
      'active',
      'paid',
      'approved',
      'uploaded',
      'completed',
    ],
    red: ['deleted', 'rejectedbysupervisor', 'paymentrejected', 'rejected'],
    orange: ['manager', 'inactive', 'pending', 'submittedforapproval'],
    purple: ['admin', 'voidcancelled', 'cancelled'],
  };

  ngOnInit(): void {
    this.class = this.getClass();
  }

  getClass(): string {
    for (const key in this.classes) {
      if (
        this.classes[key as keyof typeof this.classes].includes(
          this.text.toLowerCase().replace(/\s/g, '')
        )
      ) {
        return key;
      }
    }
    return '';
  }
}
