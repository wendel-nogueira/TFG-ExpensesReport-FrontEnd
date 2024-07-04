import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { Project } from '../../models';
import { ProjectStatus } from '@expensesreport/enums';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends RequestService {
  getAll() {
    return this.httpClient
      .get<Project[]>(`${this.projectsApiURL}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  get(id: string) {
    return this.httpClient
      .get<Project>(`${this.projectsApiURL}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getByDepartment(departmentId: string) {
    return this.httpClient
      .get<Project[]>(`${this.projectsApiURL}/department/${departmentId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  checkIfCodeExists(code: string) {
    return this.httpClient.get<boolean>(
      `${this.projectsApiURL}/code/${code}`,
      this.httpOptions
    );
  }

  create(project: {
    name: string;
    code: string;
    description: string;
    seasonsIds: string[];
    departmentsIds: string[];
  }) {
    return this.httpClient
      .post<Project>(`${this.projectsApiURL}`, project, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(project: Project) {
    return this.httpClient
      .put<Project>(
        `${this.projectsApiURL}/${project.id}`,
        project,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateStatus(id: string, status: ProjectStatus) {
    return this.httpClient
      .patch<Project>(
        `${this.projectsApiURL}/${id}/status`,
        { status },
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  addSeasons(projectId: string, seasons: string[]) {
    const body = {
      ids: seasons,
    };

    return this.httpClient
      .post<Project>(
        `${this.projectsApiURL}/${projectId}/seasons`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeSeasons(projectId: string, seasons: string[]) {
    const body = {
      ids: seasons,
    };

    return this.httpClient
      .request<Project>(
        'delete',
        `${this.projectsApiURL}/${projectId}/seasons`,
        {
          body: JSON.stringify(body),
          headers: this.httpOptions.headers,
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  addDepartments(projectId: string, departments: string[]) {
    const body = {
      ids: departments,
    };

    return this.httpClient
      .post<Project>(
        `${this.projectsApiURL}/${projectId}/departments`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeDepartments(projectId: string, departments: string[]) {
    const body = {
      ids: departments,
    };

    return this.httpClient
      .request<Project>(
        'delete',
        `${this.projectsApiURL}/${projectId}/departments`,
        {
          body: JSON.stringify(body),
          headers: this.httpOptions.headers,
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
