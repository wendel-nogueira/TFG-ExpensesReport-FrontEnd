import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  PasswordComponent as PasswordComponentModule,
} from '@expensesreport/ui';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterServiceService } from '../../services/register-service.service';
import { Password } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-password-step',
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  imports: [CommonModule, PasswordComponentModule, ButtonComponent],
})
export class PasswordComponent implements OnInit {
  password: Password | null = null;
  passwordFormGroup = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private router: Router,
    public registerService: RegisterServiceService
  ) {}

  ngOnInit() {
    this.password = this.registerService.register.password;
  }

  onSubmit() {
    if (this.passwordFormGroup.invalid) {
      this.passwordFormGroup.setErrors({
        invalid: true,
      });

      return;
    }

    this.registerService.register.password = {
      password: this.passwordFormGroup.value.password || '',
      confirmPassword: this.passwordFormGroup.value.confirmPassword || '',
    };

    console.log('submit');
    console.log(this.registerService.register);
  }

  previousPage() {
    this.registerService.register.password = {
      password: this.passwordFormGroup.value.password || '',
      confirmPassword: this.passwordFormGroup.value.confirmPassword || '',
    };

    this.router.navigate(['register/address']);
  }
}
