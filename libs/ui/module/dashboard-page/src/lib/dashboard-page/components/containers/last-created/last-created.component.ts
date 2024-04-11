import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FileComponent } from '@expensesreport/icons';

@Component({
  selector: 'expensesreport-last-created',
  standalone: true,
  templateUrl: './last-created.component.html',
  styleUrl: './last-created.component.css',
  imports: [
    CommonModule,
    FileComponent,
  ],
})
export class LastCreatedComponent implements OnInit {
  items = [
    {
      id: 1,
      user: 'John Doe',
      total: 100,
    },
    {
      id: 2,
      user: 'Jane Doe',
      total: 200,
    },
    {
      id: 3,
      user: 'John Doe',
      total: 300,
    },    {
      id: 1,
      user: 'John Doe',
      total: 100,
    },
    {
      id: 2,
      user: 'Jane Doe',
      total: 200,
    },
    {
      id: 3,
      user: 'John Doe',
      total: 300,
    }
  ]

  ngOnInit() {
    console.log('TotalByTypeComponent');
  }
}
