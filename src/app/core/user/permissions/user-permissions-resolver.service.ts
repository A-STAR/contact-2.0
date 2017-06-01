import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';
import { UserPermissionsService } from './user-permissions.service';

@Injectable()
export class UserPermissionsResolver implements Resolve<any> {

  constructor(
    private authService: AuthService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {}

  resolve(): Observable<any> {
    return this.userPermissionsService.getUserPermissions()
      // TODO: make this reusable
      .catch(error => {
        if ([401, 403].find(status => error.status === status)) {
          this.authService.redirectToLogin();
        } else {
          this.router.navigate(['/connection-error']);
        }
        throw error;
      });
  }
}
