import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsResolver implements Resolve<any> {

  constructor(
    private authService: AuthService,
    private router: Router,
    private permissionsService: PermissionsService,
  ) {}

  resolve(): Observable<any> {
    return this.permissionsService.getUserPermissions()
      // TODO: make this reusable
      .catch(error => {
        if ([401, 403].find(status => error.status === status)) {
          this.authService.redirectToLogin();
        } else {
          // TODO(a.tymchuk): should we really do it by deafult?
          this.router.navigate(['/connection-error']);
        }
        throw error;
      });
  }
}
