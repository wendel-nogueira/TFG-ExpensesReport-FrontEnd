import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  @Input() size = 24;
}
