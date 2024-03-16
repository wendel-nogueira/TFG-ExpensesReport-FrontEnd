import { Component, Input } from '@angular/core';

@Component({
  selector: 'expensesreport-page-content',
  standalone: true,
  imports: [],
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.css'
})
export class PageContentComponent {
  @Input() useShadow = true;
}
