import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'expensesreport-menu-item',
  standalone: true,
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
  imports: [CommonModule, RouterModule],
})
export class MenuItemComponent {
  @Input() href = '';
  @Input() label = '';
  @Input() active = false;
}
