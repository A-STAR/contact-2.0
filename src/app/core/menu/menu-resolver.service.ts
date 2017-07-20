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
    // TODO(d.maltsev): redirect to '/connection-error' on error
    if (this.router.navigated) {
      throw new Error('Could not resolve GUI objects.');
    } else {
      this.router.navigate(['/']);
    }
  }
}

//   resolve(): Observable<Array<IMenuApiResponseItem>> {
//     return this.menuService.guiObjects
//       // TODO: make this reusable
//       .catch(error => {
//         if ([401, 403].find(status => error.status === status)) {
//           this.authService.redirectToLogin();
//         } else {
//           this.router.navigate(['/connection-error']);
//         }
//         throw error;
//       });
//   }
