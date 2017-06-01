import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IMenuApiResponseItem } from './menu.interface';

import { AuthService } from '../auth/auth.service';
import { MenuService } from './menu.service';

@Injectable()
export class MenuResolver implements Resolve<Array<IMenuApiResponseItem>> {
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router,
  ) {}

  resolve(): Observable<Array<IMenuApiResponseItem>> {
    return this.menuService.guiObjects
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
