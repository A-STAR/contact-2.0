import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorsService } from './debtors.service';

@Injectable()
export class DebtorsResolver implements Resolve<boolean> {

  constructor(private debtorsService: DebtorsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.debtorsService.fetchDebtors();

    return this.debtorsService.isFetched()
      .map(isResolved => {
        if (isResolved === false) {
          // TODO handle error
        }
        return isResolved;
      }).take(1);
  }
}
