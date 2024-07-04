import { Component, OnInit } from '@angular/core';
import {
  PersonalComponent as PersonalComponentModule,
  ButtonComponent,
} from '@expensesreport/ui';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterServiceService } from '../../services/register-service.service';
import { Name } from '@expensesreport/models';

@Component({
  selector: 'expensesreport-personal-step',
  standalone: true,
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
  imports: [CommonModule, PersonalComponentModule, ButtonComponent],
})
export class PersonalComponent implements OnInit {
  name: Name | null = null;
  personalFormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public registerService: RegisterServiceService
  ) {}

  ngOnInit() {
    this.name = this.registerService.register.name;
  }

  nextPage() {
    if (this.personalFormGroup.invalid) {
      this.personalFormGroup.setErrors({
        invalid: true,
      });

      return;
    }

    this.registerService.register.name = {
      firstName: this.personalFormGroup.value.firstName || '',
      lastName: this.personalFormGroup.value.lastName || '',
    };

    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        this.router.navigate(['register/address'], {
          queryParams: { token: token },
        });
      }
    });
  }
}
