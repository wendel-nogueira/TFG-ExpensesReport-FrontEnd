import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-menu-text',
  standalone: true,
  imports: [],
  templateUrl: './menu-text.component.html',
  styleUrl: './menu-text.component.css'
})
export class MenuTextComponent {
  @Input() menuOpen = false;
  @Input() text = '';
}
