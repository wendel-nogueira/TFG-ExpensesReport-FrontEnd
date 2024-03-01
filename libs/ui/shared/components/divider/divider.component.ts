import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-divider',
  standalone: true,
  imports: [],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.css'
})
export class DividerComponent {
  @Input() text = '';
}
