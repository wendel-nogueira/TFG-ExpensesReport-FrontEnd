import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService extends RequestService {
  getIPAddress() {
    return this.httpClient
      .get<any>('https://api.ipify.org/?format=json')
      .pipe(catchError(this.handleError.bind(this)));
  }
}
