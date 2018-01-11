import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

interface PhoneCardRouteParams {
  contactId: number;
  phoneId: number;
}

@Component({
  selector: 'app-debtor-phone',
  templateUrl: './phone.component.html'
})
export class DebtorPhoneComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get phoneId$(): Observable<number> {
    return this.routeParams$.map(params => params.phoneId);
  }

  get entityId$(): Observable<number> {
    return Observable
      .combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactId || personId);
  }

  get routeParams$(): Observable<PhoneCardRouteParams> {
    return this.route.params as Observable<PhoneCardRouteParams>;
  }
}
