import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  PageComponent,
  PageContentComponent,
  TitleComponent,
  InputTextComponent,
  InputPasswordComponent,
  FormGroupComponent,
  DividerComponent,
  LabelComponent,
  CheckboxComponent,
  LinkComponent,
  ButtonComponent,
} from '@expensesreport/ui';

@Component({
  selector: 'expensesreport-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [
    CommonModule,
    // components
    FormsModule,
    ReactiveFormsModule,
    PageComponent,
    PageContentComponent,
    TitleComponent,
    InputTextComponent,
    InputPasswordComponent,
    FormGroupComponent,
    DividerComponent,
    LabelComponent,
    CheckboxComponent,
    LinkComponent,
    ButtonComponent,
  ],
})
export class LoginPageComponent {
  loading = false;
  disabled = false;
  loginFormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    rememberMe: new FormControl(false),
  });

  onSubmit() {
    this.loading = true;
  }
}
