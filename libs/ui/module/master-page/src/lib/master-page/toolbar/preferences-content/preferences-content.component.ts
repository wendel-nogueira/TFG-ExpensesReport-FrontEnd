import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from 'libs/ui/shared/icon/icon.component';

import { SunComponent, MoonComponent } from 'libs/ui/shared/icons';

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

  // constructor() {
  //   // document.body.classList.add('dark');
  // }

  toggleTheme() {
    this.lightTheme = !this.lightTheme;

    if (!this.lightTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
