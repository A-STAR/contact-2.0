import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

interface IIdentityCardRouteParams {
  identityId: number;
  contactId: number;
  contactPersonId: number;
}

@Component({
  selector: 'app-debtor-identity',
  templateUrl: './identity.component.html'
})
export class DebtorIdentityComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
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
        map(([ personId, params ]) => params.contactPersonId || params.contactId || personId),
        distinctUntilChanged(),
      );
  }

  get routeParams$(): Observable<IIdentityCardRouteParams> {
    return <Observable<IIdentityCardRouteParams>>this.route.params.distinctUntilChanged();
  }

  onClose(): void {
    const contactId = this.route.snapshot.paramMap.get('contactId');
    const contactPersonId = this.route.snapshot.paramMap.get('contactPersonId');
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId'),
      ...(contactId ? [ 'contact', contactId ] : []),
      ...(contactPersonId ? [ 'contact', 'create' ] : [])
    ]);
  }
}
