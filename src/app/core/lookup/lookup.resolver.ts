import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LookupService } from './lookup.service';

@Injectable()
export class LookupResolver implements Resolve<boolean> {
  constructor(
    private lookupService: LookupService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.lookupService.refreshRoles();
    this.lookupService.refreshUsers();
    return this.lookupService.isResolved
      .map(isResolved => {
        if (!isResolved) {
          this.handleError();
        }
        return isResolved;
      });
  }

  private handleError(): void {
    if (this.router.navigated) {
      throw new Error('Could not resolve lookup data.');
    } else {
      this.router.navigate(['/']);
    }
  }
}
