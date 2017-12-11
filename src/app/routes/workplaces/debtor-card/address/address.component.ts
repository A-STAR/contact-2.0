import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

interface AddressCardRouteParams {
  addressId: number;
  contactId: number;
}

@Component({
  selector: 'app-debtor-address',
  templateUrl: './address.component.html'
})
export class DebtorAddressComponent {
  static COMPONENT_NAME = 'DebtorAddressComponent';

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get addressId$(): Observable<number> {
    return this.routeParams$.map(params => params.addressId);
  }

  get entityId$(): Observable<number> {
    return Observable
      .combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactId || personId);
  }

  get routeParams$(): Observable<AddressCardRouteParams> {
    return this.route.params as Observable<AddressCardRouteParams>;
  }
}
