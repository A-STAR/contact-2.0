import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserConstantsService } from './user-constants.service';

@Injectable()
export class UserConstantsResolver implements Resolve<any> {
  constructor(private userConstantsService: UserConstantsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.userConstantsService.refresh();

    // TODO(d.maltsev)
    // return this.userConstantsService.isResolved.do(console.log);
    return Observable.of(true);
  }
}
