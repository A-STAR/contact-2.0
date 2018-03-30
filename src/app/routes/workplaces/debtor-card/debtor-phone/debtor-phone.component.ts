import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

interface PhoneCardRouteParams {
  contactPersonId: number;
  contactId: number;
  phoneId: number;
}

@Component({
  selector: 'app-debtor-phone',
  templateUrl: './debtor-phone.component.html'
})
export class DebtorPhoneComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  get phoneId$(): Observable<number> {
    return this.routeParams$.map(params => params.phoneId);
  }

  get entityId$(): Observable<number> {
    return combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactPersonId || params.contactId || personId);
  }

  get routeParams$(): Observable<PhoneCardRouteParams> {
    return this.route.params as Observable<PhoneCardRouteParams>;
  }

  onClose(): void {
    const { paramMap } = this.route.snapshot;
    const contactId       = paramMap.get('contactId');
    const contactPersonId = paramMap.get('contactPersonId');
    const debtId          = paramMap.get('debtId');
    this.routingService.navigate([
      `/workplaces/debtor-card/${debtId}`,
      ...(contactId ? [ 'contact', contactId ] : []),
      ...(contactPersonId ? [ 'contact', 'create' ] : [])
    ]);
  }
}
