import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { GuiObjectsService } from './gui-objects.service';

@Injectable()
export class GuiObjectsResolver implements Resolve<boolean> {
  constructor(
    private menuService: GuiObjectsService,
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
