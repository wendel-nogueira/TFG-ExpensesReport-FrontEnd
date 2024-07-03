import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { catchError } from 'rxjs/operators';
import { Identity } from '@expensesreport/models';

@Injectable({
  providedIn: 'root',
})
export class IdentityService extends RequestService {
  sendResetPasswordEmail(email: string) {
    return this.httpClient
      .post<void>(
        `${this.authenticationApiURL}/send-reset-password-email`,
        JSON.stringify({ email }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  sendCreateAccountEmail(email: string) {
    return this.httpClient
      .post<void>(
        `${this.authenticationApiURL}/send-create-account-email`,
        JSON.stringify({ email }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  sendChangeEmailEmail(email: string) {
    return this.httpClient
      .post<void>(
        `${this.authenticationApiURL}/send-change-email-email`,
        JSON.stringify({ email }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  getMe(token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient
      .get<Identity>(`${this.authenticationApiURL}/me`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  checkIfEmailExists(email: string) {
    return this.httpClient.get<boolean>(
      `${this.authenticationApiURL}/email/${email}`,
      this.httpOptions
    );
  }

  checkIfResetPasswordTokenIsValid(resetPasswordToken: string, token: string) {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient
      .get<boolean>(
        `${this.authenticationApiURL}/reset-token/${resetPasswordToken}`,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(identity: Identity) {
    return this.httpClient
      .put<Identity>(
        `${this.authenticationApiURL}/${identity.id}`,
        JSON.stringify(identity),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateStatus(id: string, status: number) {
    return this.httpClient
      .patch<Identity>(
        `${this.authenticationApiURL}/${id}/status`,
        JSON.stringify({ status: status }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updatePassword(
    data: {
      resetToken: string;
      newPassword: string;
      confirmPassword: string;
    },
    token: string
  ) {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient
      .put<void>(
        `${this.authenticationApiURL}/password`,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  confirmChangeEmail(data: {
    changeEmailToken: string;
    newEmail: string;
    confirmEmail: string;
  }) {
    return this.httpClient
      .put<void>(
        `${this.authenticationApiURL}/email`,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  create(identity: Identity) {
    return this.httpClient
      .post<Identity>(
        `${this.authenticationApiURL}`,
        JSON.stringify(identity),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  createPassword(data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.httpClient
      .post<void>(
        `${this.authenticationApiURL}/password`,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
