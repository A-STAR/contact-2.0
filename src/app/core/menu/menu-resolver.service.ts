import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MenuService } from './menu.service';

@Injectable()
export class MenuResolver implements Resolve<boolean> {
  constructor(
    private menuService: MenuService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.menuService.refreshGuiObjects();
    return this.menuService.isResolved
      .map(isResolved => {
        if (!isResolved) {
          this.handleError();
        }
        return isResolved;
      });
  }

  private handleError(): void {
    if (this.router.navigated) {
      throw new Error('Could not resolve GUI objects.');
    }
  }
}
