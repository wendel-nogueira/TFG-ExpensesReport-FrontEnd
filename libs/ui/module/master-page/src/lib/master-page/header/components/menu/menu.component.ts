import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { MenuButtonComponent } from '../menu-button/menu-button.component';
import { MenuLinkComponent } from '../menu-link/menu-link.component';
import { MenuExpandedComponent } from '../menu-expanded/menu-expanded.component';
import { MenuTextComponent } from '../menu-text/menu-text.component';
import { IconComponent } from '@expensesreport/ui';
import { RouterModule } from '@angular/router';

import {
  DashboardComponent,
  DepartmentComponent,
  FileComponent,
  ProjectComponent,
  UserGroupComponent,
  WalletComponent,
} from '@expensesreport/icons';

export interface MenuItems {
  label: string;
  title: string;
  icon: string;
  enabled: boolean;
  itemsQuantity: number;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  enabled: boolean;
  href: string;
}

export interface Permissions {
  create: boolean;
  manage: boolean;
}

@Component({
  selector: 'expensesreport-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [
    CommonModule,
    RouterModule,
    MenuButtonComponent,
    MenuLinkComponent,
    MenuExpandedComponent,
    MenuTextComponent,
    IconComponent,
    DashboardComponent,
    DepartmentComponent,
    FileComponent,
    ProjectComponent,
    UserGroupComponent,
    WalletComponent,
  ],
})
export class MenuComponent implements OnChanges, OnInit {
  @Input() menuOpen = false;
  @Input() changedSelectedMenu = '';
  @Output() openMenu = new EventEmitter<void>();

  selectedMenu = '';
  menuItems: MenuItems[] = allMenuItems;
  permissions: { [key: string]: Permissions } = {
    users: {
      create: true,
      manage: true,
    },
    departments: {
      create: true,
      manage: true,
    },
    projects: {
      create: true,
      manage: true,
    },
    expense_accounts: {
      create: true,
      manage: true,
    },
    expense_reports: {
      create: true,
      manage: false,
    },
  };

  ngOnChanges(changes: {
    menuOpen?: SimpleChange;
    changedSelectedMenu?: SimpleChange;
  }) {
    if (changes.menuOpen && !changes.menuOpen.currentValue) {
      this.selectedMenu = '';
    }

    if (changes.changedSelectedMenu) {
      this.selectedMenu = changes.changedSelectedMenu.currentValue;
    }
  }

  ngOnInit() {
    this.loadMenus();
  }

  onMenuClick(menu: string, useExpanded = true) {
    if ((!this.menuOpen && useExpanded) || (this.menuOpen && !useExpanded))
      this.openMenu.emit();

    if (this.selectedMenu === menu) {
      this.selectedMenu = '';
      return;
    }

    this.selectedMenu = menu;
  }

  loadMenus() {
    this.menuItems = this.menuItems.map((menu) => {
      const newMenu = { ...menu };
      newMenu.enabled =
        this.permissions[menu.label].create ||
        this.permissions[menu.label].manage;

      newMenu.items = newMenu.items.map((item) => {
        const newItem = { ...item };
        newItem.enabled =
          this.permissions[menu.label as keyof Permissions][
            item.title as keyof Permissions
          ];
        return newItem;
      });

      newMenu.itemsQuantity = newMenu.items.filter(
        (item) => item.enabled
      ).length;
      return newMenu;
    });
  }
}

const allMenuItems: MenuItems[] = [
  {
    label: 'users',
    title: 'users',
    icon: 'user-group',
    enabled: true,
    itemsQuantity: 2,
    items: [
      {
        title: 'create',
        enabled: true,
        href: 'users/create',
      },
      {
        title: 'manage',
        enabled: true,
        href: 'users',
      },
    ],
  },
  {
    label: 'departments',
    title: 'departments',
    icon: 'department',
    enabled: true,
    itemsQuantity: 2,
    items: [
      {
        title: 'create',
        enabled: true,
        href: '/',
      },
      {
        title: 'manage',
        enabled: true,
        href: '/',
      },
    ],
  },
  {
    label: 'projects',
    title: 'projects',
    icon: 'project',
    enabled: true,
    itemsQuantity: 2,
    items: [
      {
        title: 'create',
        enabled: true,
        href: '/',
      },
      {
        title: 'manage',
        enabled: true,
        href: '/',
      },
    ],
  },
  {
    label: 'expense_accounts',
    title: 'expense accounts',
    icon: 'wallet',
    enabled: true,
    itemsQuantity: 2,
    items: [
      {
        title: 'create',
        enabled: true,
        href: '/',
      },
      {
        title: 'manage',
        enabled: true,
        href: '/',
      },
    ],
  },
  {
    label: 'expense_reports',
    title: 'expense reports',
    icon: 'file',
    enabled: true,
    itemsQuantity: 2,
    items: [
      {
        title: 'create',
        enabled: true,
        href: '/',
      },
      {
        title: 'manage',
        enabled: true,
        href: '/',
      },
    ],
  },
];
