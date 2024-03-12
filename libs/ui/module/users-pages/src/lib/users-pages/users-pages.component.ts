import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-users-pages',
  standalone: true,
  templateUrl: './users-pages.component.html',
  styleUrl: './users-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class UsersPagesComponent {}
