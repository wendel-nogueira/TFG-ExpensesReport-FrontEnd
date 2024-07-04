import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { Season } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SeasonService extends RequestService {
  getAll() {
    return this.httpClient
      .get<Season[]>(`${this.seasonsApiURL}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  get(id: string) {
    return this.httpClient
      .get<Season>(`${this.seasonsApiURL}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  checkIfCodeExists(code: string) {
    return this.httpClient.get<boolean>(
      `${this.seasonsApiURL}/code/${code}`,
      this.httpOptions
    );
  }

  create(season: Season) {
    return this.httpClient
      .post<Season>(`${this.seasonsApiURL}`, season, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(season: Season) {
    return this.httpClient
      .put<Season>(
        `${this.seasonsApiURL}/${season.id}`,
        season,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete(id: string) {
    return this.httpClient
      .delete<Season>(`${this.seasonsApiURL}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  addProjects(seasonId: string, projects: string[]) {
    const body = {
      ids: projects,
    };

    return this.httpClient
      .post<Season>(
        `${this.seasonsApiURL}/${seasonId}/projects`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeProjects(seasonId: string, projects: string[]) {
    const body = {
      ids: projects,
    };

    return this.httpClient
      .request<Season>('delete', `${this.seasonsApiURL}/${seasonId}/projects`, {
        body: JSON.stringify(body),
        headers: this.httpOptions.headers,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
