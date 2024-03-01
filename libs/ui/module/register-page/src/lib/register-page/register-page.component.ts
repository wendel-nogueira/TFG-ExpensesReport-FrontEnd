import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import {
  PageComponent,
  PageContentComponent,
  PasswordComponent,
  AddressComponent,
  PersonalComponent,
} from '@expensesreport/ui';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'expensesreport-register-page',
  standalone: true,
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  imports: [
    CommonModule,
    PageComponent,
    PageContentComponent,
    StepsModule,

    PasswordComponent,
    AddressComponent,
    PersonalComponent,
  ],
})
export class RegisterPageComponent {
  steps: MenuItem[] = [
    {
      label: 'Personal',
      routerLink: ['personal'],
    },
    { label: 'Address', routerLink: ['address'] },
    { label: 'Password', routerLink: ['password'] },
  ];
}
