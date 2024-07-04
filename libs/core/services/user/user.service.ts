import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { User } from '../../models/User';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends RequestService {
  getMe() {
    return this.httpClient.get<User>(
      `${this.usersApiURL}/me`,
      this.httpOptions
    );
  }

  getAll() {
    return this.httpClient
      .get<User[]>(`${this.usersApiURL}?includeIdentity=true`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getUser(id: string) {
    return this.httpClient
      .get<User>(`${this.usersApiURL}/${id}?includeRelationships=true`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getUserByIdentity(identity: string) {
    return this.httpClient
      .get<User>(`${this.usersApiURL}/identity/${identity}?includeRelationships=true`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  update(user: User) {
    return this.httpClient
      .put<User>(
        `${this.usersApiURL}/${user.id}`,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  create(
    user: { email: string; password: string; confirmPassword: string } & User,
    token: string
  ) {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient
      .post<User>(`${this.usersApiURL}`, JSON.stringify(user), this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  addSupervisors(userId: string, supervisors: string[]) {
    const body = {
      ids: supervisors,
    };

    return this.httpClient
      .post<User>(
        `${this.usersApiURL}/${userId}/supervisors`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeSupervisors(userId: string, supervisors: string[]) {
    const body = {
      ids: supervisors,
    };

    return this.httpClient
      .request<User>('delete', `${this.usersApiURL}/${userId}/supervisors`, {
        body: JSON.stringify(body),
        headers: this.httpOptions.headers,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  addSupervised(userId: string, supervised: string[]) {
    const body = {
      ids: supervised,
    };

    return this.httpClient
      .post<User>(
        `${this.usersApiURL}/${userId}/supervised`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeSupervised(userId: string, supervised: string[]) {
    const body = {
      ids: supervised,
    };

    return this.httpClient
      .request<User>('delete', `${this.usersApiURL}/${userId}/supervised`, {
        body: JSON.stringify(body),
        headers: this.httpOptions.headers,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
