import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent, ButtonComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-not-found-page',
  standalone: true,
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css',
  imports: [CommonModule, PageComponent, ButtonComponent],
})
export class NotFoundPageComponent {}
