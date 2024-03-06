import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@expensesreport/ui';
import { TooltipModule } from 'primeng/tooltip';
import { PreferencesContentComponent } from './preferences-content/preferences-content.component';

import { PreferencesComponent } from '@expensesreport/icons';

@Component({
  selector: 'expensesreport-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
  imports: [
    CommonModule,
    // Components
    IconComponent,
    TooltipModule,
    PreferencesContentComponent,
    // Icons
    PreferencesComponent,
  ],
})
export class ToolbarComponent implements OnChanges {
  @Input() menuOpen = false;
  openPreferences = false;

  ngOnChanges(changes: { menuOpen: SimpleChange }) {
    if (changes.menuOpen && changes.menuOpen.currentValue)
      this.openPreferences = false;
  }

  onOpenPreferences() {
    this.openPreferences = !this.openPreferences;
  }
}
