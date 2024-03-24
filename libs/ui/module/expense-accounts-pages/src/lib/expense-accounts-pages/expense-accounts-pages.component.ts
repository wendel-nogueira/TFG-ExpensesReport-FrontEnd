import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-expense-accounts-pages',
  standalone: true,
  templateUrl: './expense-accounts-pages.component.html',
  styleUrl: './expense-accounts-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class ExpenseAccountsPagesComponent {}
