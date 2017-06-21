import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserLanguagesService } from './user-languages.service';

@Injectable()
export class UserLanguagesResolver implements Resolve<any> {
  constructor(private userLanguagesService: UserLanguagesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.userLanguagesService.refresh();
    return this.userLanguagesService.isResolved
      .filter(isResolved => isResolved)
      .take(1);
  }
}
