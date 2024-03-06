import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const role = this.authService.getSessionData()?.role;
    const data = route.data;
    let rolesAllowed = [];

    if (!role) return false;

    if (data && data['rolesAllowed']) rolesAllowed = data['rolesAllowed'];
    else return false;

    if (rolesAllowed.length === 0) return false;

    if (rolesAllowed.includes(role)) return true;

    return false;
  }
}
