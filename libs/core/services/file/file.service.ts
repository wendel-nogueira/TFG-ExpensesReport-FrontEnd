import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class FileService extends RequestService {
  upload(file: File): any {
    const formData = new FormData();

    formData.append('inputFile', file);

    return this.httpClient
      .post<string>(`${this.filesApiURL}`, formData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  download(path: string): any {
    return this.httpClient
      .get(`${this.filesApiURL}/${path}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete(path: string): any {
    return this.httpClient
      .delete(`${this.filesApiURL}/${path}`)
      .pipe(catchError(this.handleError.bind(this)));
  }
}
