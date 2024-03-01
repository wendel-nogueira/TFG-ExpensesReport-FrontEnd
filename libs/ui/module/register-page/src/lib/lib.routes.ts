import { Route } from '@angular/router';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AddressComponent } from './register-page/steps/address/address.component';
import { PasswordComponent } from './register-page/steps/password/password.component';
import { PersonalComponent } from './register-page/steps/personal/personal.component';

export const registerPageRoutes: Route[] = [
  {
    path: '',
    component: RegisterPageComponent,
    children: [
      { path: 'address', component: AddressComponent },
      { path: 'password', component: PasswordComponent },
      { path: 'personal', component: PersonalComponent },
    ],
  },
];
