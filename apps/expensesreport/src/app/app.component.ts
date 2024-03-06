import { Component, OnInit, isDevMode } from '@angular/core';

@Component({
  selector: 'expensesreport-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Expenses Report';

  ngOnInit() {
    if (isDevMode()) console.log('Development');
    else console.log('Production');
  }
}
