import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-projects-pages',
  standalone: true,
  templateUrl: './projects-pages.component.html',
  styleUrl: './projects-pages.component.css',
  imports: [CommonModule, RouterModule, PageTitleComponent],
})
export class ProjectsPagesComponent {}
