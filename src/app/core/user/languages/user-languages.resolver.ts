import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserLanguagesService } from './user-languages.service';

@Injectable()
export class UserLanguagesResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private userLanguagesService: UserLanguagesService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.userLanguagesService.refresh();
    return this.userLanguagesService.isResolved
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
      throw new Error('Could not resolve user languages.');
    } else {
      this.router.navigate(['/']);
    }
  }
}
