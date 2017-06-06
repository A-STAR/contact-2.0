import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsResolver implements Resolve<any> {

  constructor(
    private permissionsService: PermissionsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.permissionsService.resolvePermissions();
  }
}
