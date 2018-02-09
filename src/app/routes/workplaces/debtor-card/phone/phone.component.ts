import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

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
    private routingService: RoutingService
  ) {}

  get phoneId$(): Observable<number> {
    return this.routeParams$.map(params => params.phoneId);
  }

  get entityId$(): Observable<number> {
    return combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactId || personId);
  }

  get routeParams$(): Observable<PhoneCardRouteParams> {
    return this.route.params as Observable<PhoneCardRouteParams>;
  }

  onClose(): void {
    const contactId = this.route.snapshot.paramMap.get('contactId');
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId'),
      ...(contactId ? [ 'contact', contactId ] : [])
    ]);
  }
}
