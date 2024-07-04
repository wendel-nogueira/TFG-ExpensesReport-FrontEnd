import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-seasons-pages',
  standalone: true,
  templateUrl: './seasons-pages.component.html',
  styleUrl: './seasons-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class SeasonsPagesComponent {}
