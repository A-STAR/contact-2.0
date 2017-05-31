import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserPermissionsService } from './user-permissions.service';

@Injectable()
export class UserPermissionsResolver implements Resolve<any> {

  constructor(
    private userPermissionsService: UserPermissionsService
  ) {}

  resolve(): Observable<any> {
    return this.userPermissionsService.getUserPermissions();
  }
}
