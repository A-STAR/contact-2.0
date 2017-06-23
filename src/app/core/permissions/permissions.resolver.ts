import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsResolver implements Resolve<any> {

  constructor(
    private permissionsService: PermissionsService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.permissionsService
      .resolvePermissions()
      .catch(error => {
        // Temporary solution.
        // PermissionsResolver will be replaced with UserPermissionsResolver.
        this.router.navigate(['/']);
        throw error;
      });
  }
}
