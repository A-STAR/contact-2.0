import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from './debtor.service';

@Injectable()
export class DebtorResolver implements Resolve<boolean> {

  constructor(private debtorService: DebtorService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const debtorId = parseInt(route.params.id, 10);
    this.debtorService.fetch(debtorId);

    return this.debtorService.isFetched(debtorId)
      .map(isResolved => {
        if (isResolved === false) {
          // TODO handle error
        }
        return isResolved;
      }).take(1);
  }
}
