import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserConstantsService } from './user-constants.service';

@Injectable()
export class UserConstantsResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private userConstantsService: UserConstantsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.userConstantsService.refresh();
    return this.userConstantsService.isResolved
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
      throw new Error('Could not resolve user constants.');
    } else {
      this.router.navigate(['/']);
    }
  }
}
