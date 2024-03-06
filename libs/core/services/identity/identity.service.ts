import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IdentityService extends RequestService {
  sendResetPasswordEmail(email: string) {
    return this.httpClient
      .post<void>(
        `${this.identityApiURL}/forgot-password`,
        JSON.stringify({ email }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
