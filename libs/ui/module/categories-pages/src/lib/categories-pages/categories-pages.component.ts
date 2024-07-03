import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@expensesreport/ui';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'expensesreport-categories-pages',
  standalone: true,
  templateUrl: './categories-pages.component.html',
  styleUrl: './categories-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class CategoriesPagesComponent {}
