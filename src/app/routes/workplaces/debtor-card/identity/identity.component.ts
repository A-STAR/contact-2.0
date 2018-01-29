import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { map, distinctUntilChanged } from 'rxjs/operators';

interface IIdentityCardRouteParams {
  identityId: number;
  contactId: number;
}

@Component({
  selector: 'app-debtor-identity',
  templateUrl: './identity.component.html'
})
export class DebtorIdentityComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute
  ) {}

  get identityId$(): Observable<number> {
    return this.routeParams$.map(params => params.identityId);
  }

  /**
   * Depending on the route, this can be either a personId or a contactId
   */
  get personId$(): Observable<number> {
    return combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .pipe(
        map(([ personId, params ]) => params.contactId || personId),
        distinctUntilChanged(),
      );
  }

  get routeParams$(): Observable<IIdentityCardRouteParams> {
    return <Observable<IIdentityCardRouteParams>>this.route.params.distinctUntilChanged();
  }
}
