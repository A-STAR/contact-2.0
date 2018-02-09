import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IncomingCallService } from '../incoming-call.service';
import { map } from 'rxjs/operators/map';

interface PhoneCardRouteParams {
  contactId: number;
  phoneId: number;
}

@Component({
  selector: 'app-incoming-call-phone-card',
  templateUrl: './phone-card.component.html'
})
export class PhoneCardComponent {
  constructor(
    private incomingCallService: IncomingCallService,
    private route: ActivatedRoute,
  ) {}

  get phoneId$(): Observable<number> {
    return this.routeParams$.map(params => params.phoneId);
  }

  get entityId$(): Observable<number> {
    return this.incomingCallService.selectedDebtor$.pipe(
      map(debtor => debtor ? debtor.personId : null),
    );
  }

  get routeParams$(): Observable<PhoneCardRouteParams> {
    return this.route.params as Observable<PhoneCardRouteParams>;
  }
}
