import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'expensesreport-tab-menu',
  standalone: true,
  templateUrl: './tab-menu.component.html',
  styleUrl: './tab-menu.component.css',
  imports: [CommonModule, TabMenuModule],
})
export class TabMenuComponent {
  @Input() items: MenuItem[] | undefined;
  @Input() activeItem: MenuItem | undefined;
  @Output() onTabChange = new EventEmitter<MenuItem>();

  constructor() {}

  activeItemChange(item: MenuItem) {
    this.onTabChange.emit(item);
  }
}
