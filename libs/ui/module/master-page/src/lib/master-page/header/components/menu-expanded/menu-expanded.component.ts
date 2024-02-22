import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-menu-expanded',
  standalone: true,
  imports: [],
  templateUrl: './menu-expanded.component.html',
  styleUrl: './menu-expanded.component.css'
})
export class MenuExpandedComponent {
  @Input() menuOpen = false;
  @Input() selectedMenu = false;
  @Input() quantity = 0;
}
