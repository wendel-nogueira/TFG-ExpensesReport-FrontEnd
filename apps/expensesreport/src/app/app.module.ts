import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastComponent, DialogComponent } from '@expensesreport/ui';
import { ToastService, DialogService } from '@expensesreport/services';
import { AuthInterceptor } from '@expensesreport/interceptors';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { environments } from '../environments/environments';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastComponent,
    DialogComponent,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers: [
    MessageService,
    ToastService,
    ConfirmationService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return environments.jwtToken;
    },
    whitelistedDomains: [environments.jwtDomain],
  };
}
