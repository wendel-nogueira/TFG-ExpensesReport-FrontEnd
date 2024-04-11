import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-expense-reports-pages',
  standalone: true,
  templateUrl: './expense-reports-pages.component.html',
  styleUrl: './expense-reports-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class ExpenseReportsPagesComponent {}
