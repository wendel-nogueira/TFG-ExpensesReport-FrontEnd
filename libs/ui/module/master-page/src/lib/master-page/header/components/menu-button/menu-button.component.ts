import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'expensesreport-menu-button',
  standalone: true,
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.css',
  imports: [TooltipModule],
})
export class MenuButtonComponent {
  @Input() menuOpen = false;
  @Input() active = false;
  @Input() useExpanded = true;
  @Input() tooltip = '';
  @Input() selectedMenu = false;
  @Input() useBackgroundHover = true;
  @Input() color = 'blue';
}
