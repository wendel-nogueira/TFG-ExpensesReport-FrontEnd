import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-information',
  standalone: true,
  imports: [],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
  @Input() menuOpen = false;
  @Input() title = '';
  @Input() subTitle = '';
}
