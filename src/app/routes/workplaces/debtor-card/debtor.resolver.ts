import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators/first';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { DebtorCardService } from '../../../core/app-modules/debtor-card/debtor-card.service';

@Injectable()
export class DebtorCardResolver implements Resolve<boolean> {
  constructor(
    private debtorCardService: DebtorCardService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const debtId = route.paramMap.get('debtId');
    this.debtorCardService.initByDebtId(Number(debtId));
    return this.debtorCardService.hasLoaded$
      .filter(Boolean)
      .pipe(first(), takeUntil(this.debtorCardService.hasFailed$.filter(Boolean)));
  }
}