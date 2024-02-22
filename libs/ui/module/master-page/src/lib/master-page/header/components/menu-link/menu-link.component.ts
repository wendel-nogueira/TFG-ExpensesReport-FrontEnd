import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-menu-link',
  standalone: true,
  imports: [],
  templateUrl: './menu-link.component.html',
  styleUrl: './menu-link.component.css',
})
export class MenuLinkComponent {
  @Input() href = '#';
}
