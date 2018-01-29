import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

interface AddressCardRouteParams {
  contactId: number;
}

@Component({
  selector: 'app-debtor-contacts',
  templateUrl: './contacts.component.html'
})
export class DebtorContactsComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute
  ) {}

  get contactId$(): Observable<number> {
    return this.routeParams$.map(params => params.contactId);
  }

  get personId$(): Observable<number> {
    return this.debtorCardService.personId$;
  }

  get routeParams$(): Observable<AddressCardRouteParams> {
    return this.route.params as Observable<AddressCardRouteParams>;
  }
}
