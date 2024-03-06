import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from '@expensesreport/ui';

import { SunComponent, MoonComponent } from '@expensesreport/icons';

@Component({
  selector: 'expensesreport-preferences-content',
  standalone: true,
  templateUrl: './preferences-content.component.html',
  styleUrl: './preferences-content.component.css',
  imports: [
    CommonModule,
    // Components
    IconComponent,
    // Icons
    SunComponent,
    MoonComponent,
  ],
})
export class PreferencesContentComponent {
  lightTheme = true;

  toggleTheme() {
    this.lightTheme = !this.lightTheme;

    if (!this.lightTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
