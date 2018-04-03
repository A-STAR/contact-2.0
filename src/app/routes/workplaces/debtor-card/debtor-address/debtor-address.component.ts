import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

interface AddressCardRouteParams {
  addressId: number;
  contactId: number;
  contactPersonId: number;
}

@Component({
  selector: 'app-debtor-address',
  templateUrl: './debtor-address.component.html'
})
export class DebtorAddressComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {}

  get addressId$(): Observable<number> {
    return this.routeParams$.map(params => params.addressId);
  }

  get entityId$(): Observable<number> {
    return combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactPersonId || params.contactId || personId);
  }

  get routeParams$(): Observable<AddressCardRouteParams> {
    return this.route.params as Observable<AddressCardRouteParams>;
  }

  onClose(): void {
    const { paramMap } = this.route.snapshot;
    const contactId       = paramMap.get('contactId');
    const contactPersonId = paramMap.get('contactPersonId');
    const debtId          = paramMap.get('debtId');
    this.routingService.navigate([
      `/app/workplaces/debtor-card/${debtId}`,
      ...(contactId ? [ 'contact', contactId ] : []),
      ...(contactPersonId ? [ 'contact', 'create' ] : [])
    ]);
  }
}
