import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

interface IIdentityCardRouteParams {
  identityId: number;
  contactId: number;
}

@Component({
  selector: 'app-debtor-identity',
  templateUrl: './identity.component.html'
})
export class DebtorIdentityComponent {
  static COMPONENT_NAME = 'DebtorIdentityComponent';

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get identityId$(): Observable<number> {
    return this.routeParams$.map(params => params.identityId);
  }

  /**
   * Depending on the route, this can be either a personId or a contactId
   */
  get personId$(): Observable<number> {
    return Observable
      .combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactId || personId)
      .distinctUntilChanged();
  }

  get routeParams$(): Observable<IIdentityCardRouteParams> {
    return <Observable<IIdentityCardRouteParams>>this.route.params.distinctUntilChanged();
  }
}
