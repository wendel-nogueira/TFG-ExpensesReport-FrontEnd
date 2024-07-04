import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { RequestService } from '../request/request.service';
import { Department } from '../../models';
import { DepartmentStatus } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService extends RequestService {
  getAll() {
    return this.httpClient
      .get<Department[]>(`${this.departmentsApiURL}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  get(id: string) {
    return this.httpClient
      .get<Department>(
        `${this.departmentsApiURL}/${id}?includeRelationships=true`
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  checkIfAcronymExists(acronym: string) {
    return this.httpClient.get<boolean>(
      `${this.departmentsApiURL}/acronym/${acronym}`,
      this.httpOptions
    );
  }

  create(department: Department) {
    return this.httpClient
      .post<Department>(
        `${this.departmentsApiURL}`,
        department,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(department: Department) {
    return this.httpClient
      .put<Department>(
        `${this.departmentsApiURL}/${department.id}`,
        department,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateStatus(id: string, status: DepartmentStatus) {
    return this.httpClient
      .patch<Department>(
        `${this.departmentsApiURL}/${id}/status`,
        { status },
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  addManagers(departmentId: string, managers: string[]) {
    const body = {
      ids: managers,
    };

    return this.httpClient
      .post<Department>(
        `${this.departmentsApiURL}/${departmentId}/managers`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeManagers(departmentId: string, managers: string[]) {
    const body = {
      ids: managers,
    };

    return this.httpClient
      .request<Department>(
        'delete',
        `${this.departmentsApiURL}/${departmentId}/managers`,
        {
          body: JSON.stringify(body),
          headers: this.httpOptions.headers,
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  addEmployees(departmentId: string, employees: string[]) {
    const body = {
      ids: employees,
    };

    return this.httpClient
      .post<Department>(
        `${this.departmentsApiURL}/${departmentId}/employees`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeEmployees(departmentId: string, employees: string[]) {
    const body = {
      ids: employees,
    };

    return this.httpClient
      .request<Department>(
        'delete',
        `${this.departmentsApiURL}/${departmentId}/employees`,
        {
          body: JSON.stringify(body),
          headers: this.httpOptions.headers,
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}
