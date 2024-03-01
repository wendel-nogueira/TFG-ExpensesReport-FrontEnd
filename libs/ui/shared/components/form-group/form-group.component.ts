import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-form-group',
  standalone: true,
  imports: [],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.css',
})
export class FormGroupComponent {
  @Input() useColumn = true;
}
