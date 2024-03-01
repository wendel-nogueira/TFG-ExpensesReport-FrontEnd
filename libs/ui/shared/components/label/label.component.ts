import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-label',
  standalone: true,
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
})
export class LabelComponent {
  @Input() id = '';
  @Input() label = '';
}
