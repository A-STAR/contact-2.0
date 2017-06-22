import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserPermissionsService } from './user-permissions.service';

@Injectable()
export class UserPermissionsResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private userPermissionsService: UserPermissionsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.userPermissionsService.refresh();
    return this.userPermissionsService.isResolved
      .map(isResolved => {
        if (isResolved === false) {
          this.handleError();
        }
        return isResolved;
      })
      .take(1);
  }

  private handleError(): void {
    if (this.router.navigated) {
      throw new Error('Could not resolve user permissions.');
    } else {
      this.router.navigate(['/']);
    }
  }
}
