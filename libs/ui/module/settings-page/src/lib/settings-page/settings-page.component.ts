import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from '@expensesreport/icons';
import { ContainerComponent } from './components/container/container.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'expensesreport-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  imports: [
    CommonModule,
    SettingsComponent,
    ContainerComponent,
    MenuItemComponent,
    RouterModule,
  ],
})
export class SettingsPageComponent implements OnInit {
  selectedMenu = 'account';

  constructor(private router: Router) {}

  setSelectedMenu(menu: string) {
    this.selectedMenu = menu;
  }

  ngOnInit() {
    const currentRoute = this.router.url;

    if (currentRoute === '/settings/account') {
      this.selectedMenu = 'account';
    } else if (currentRoute === '/settings/security') {
      this.selectedMenu = 'security';
    }
  }
}
