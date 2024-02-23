import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-link',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css'
})
export class LinkComponent {
  @Input() text = '';
  @Input() href = '';
}
