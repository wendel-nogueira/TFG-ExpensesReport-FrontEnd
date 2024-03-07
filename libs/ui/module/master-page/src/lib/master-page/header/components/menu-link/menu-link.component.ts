import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'expensesreport-menu-link',
  standalone: true,
  templateUrl: './menu-link.component.html',
  styleUrl: './menu-link.component.css',
  imports: [CommonModule, RouterModule],
})
export class MenuLinkComponent {
  @Input() href = '#';
}
