import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-departments-pages',
  standalone: true,
  templateUrl: './departments-pages.component.html',
  styleUrl: './departments-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class DepartmentsPagesComponent {}
