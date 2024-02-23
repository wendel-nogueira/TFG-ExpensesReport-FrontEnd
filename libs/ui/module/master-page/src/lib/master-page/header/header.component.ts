import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { IconComponent, DividerComponent } from '@expensesreport/ui';
import { MenuTextComponent } from './components/menu-text/menu-text.component';
import { InformationComponent } from './components/information/information.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { MenuComponent } from './components/menu/menu.component';

import {
  ArrowLeftComponent,
  LogoutComponent,
  ProfileComponent,
  SettingsComponent,
} from '@expensesreport/icons';

@Component({
  selector: 'expensesreport-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [
    CommonModule,
    // Components
    TooltipModule,
    IconComponent,
    InformationComponent,
    MenuTextComponent,
    MenuButtonComponent,
    MenuComponent,
    DividerComponent,
    // Icons
    ArrowLeftComponent,
    ProfileComponent,
    SettingsComponent,
    LogoutComponent,
  ],
})
export class HeaderComponent {
  @Input() menuOpen = false;
  @Input() isMobile = false;
  @Output() openMenu = new EventEmitter<void>();

  changedSelectedMenu = '';

  name = 'Wendel Nogueira';
  roleName = 'Field Staff';

  onOpenMenu() {
    this.openMenu.emit();
  }

  changeMenu(menu: string) {
    this.changedSelectedMenu = menu;

    if (this.menuOpen) this.openMenu.emit();
  }
}
