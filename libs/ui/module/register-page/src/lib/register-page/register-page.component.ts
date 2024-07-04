import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import {
  PageComponent,
  PageContentComponent,
  PasswordComponent,
  AddressComponent,
  PersonalComponent,
  ToastComponent,
} from '@expensesreport/ui';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  IdentityService,
  ToastService,
} from '@expensesreport/services';
import { UserStatus } from '@expensesreport/enums';

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
    ToastComponent,
  ],
  providers: [MessageService],
})
export class RegisterPageComponent implements OnInit {
  token: string | null = null;
  steps: MenuItem[] = [
    {
      label: 'Personal',
      routerLink: ['personal'],
    },
    { label: 'Address', routerLink: ['address'] },
    { label: 'Password', routerLink: ['password'] },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private identityService: IdentityService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params['token'];

      if (!token) {
        this.router.navigate(['login']);
        return;
      }

      this.token = token;

      const tokenDecoded = this.authService.decodeToken(token);
      const tokenInvalid = this.authService.isExpired(token);

      if (!tokenDecoded || tokenInvalid) {
        this.toastService.showError('Invalid token, request a new one');
        this.router.navigate(['login']);
        return;
      }

      this.identityService.getMe(token).subscribe(
        (user) => {
          if (
            user.status === UserStatus.Active ||
            user.status === UserStatus.Deleted
          ) {
            this.router.navigate(['login']);
            return;
          }

          this.router.navigate(['register/personal'], {
            queryParams: { token: this.token },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }
}
