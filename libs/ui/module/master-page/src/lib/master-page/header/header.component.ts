import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { IconComponent, DividerComponent } from '@expensesreport/ui';
import { MenuTextComponent } from './components/menu-text/menu-text.component';
import { InformationComponent } from './components/information/information.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { MenuComponent } from './components/menu/menu.component';
import { AuthService } from '@expensesreport/services';
import { RouterModule } from '@angular/router';

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
    TooltipModule,
    IconComponent,
    InformationComponent,
    MenuTextComponent,
    MenuButtonComponent,
    MenuComponent,
    DividerComponent,
    RouterModule,
    ArrowLeftComponent,
    ProfileComponent,
    SettingsComponent,
    LogoutComponent,
  ],
})
export class HeaderComponent implements OnInit {
  @Input() menuOpen = false;
  @Input() isMobile = false;
  @Output() openMenu = new EventEmitter<void>();

  changedSelectedMenu = '';

  name = 'Wendel Nogueira';
  roleName = 'Field Staff';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.changedSelectedMenu = 'dashboard';

    const tokenData = this.authService.getSessionData();

    if (tokenData) {
      this.name = tokenData.name;
      this.roleName = tokenData.role;
    }
  }

  onOpenMenu() {
    this.openMenu.emit();
  }

  changeMenu(menu: string) {
    this.changedSelectedMenu = menu;

    if (this.menuOpen) this.openMenu.emit();
  }

  onSignOut() {
    this.authService.logout();
  }
}
