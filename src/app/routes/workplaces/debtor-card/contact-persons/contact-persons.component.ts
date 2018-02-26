import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

interface AddressCardRouteParams {
  contactId: number;
}

@Component({
  host: { class: 'full-height' },
  selector: 'app-contact-persons',
  templateUrl: './contact-persons.component.html'
})
export class ContactPersonsComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute
  ) {}

  get contactId$(): Observable<number> {
    return this.routeParams$
      .map(params => Number(params.contactId));
  }

  get personId$(): Observable<number> {
    return this.debtorCardService.personId$;
  }

  get routeParams$(): Observable<AddressCardRouteParams> {
    return this.route.params as Observable<AddressCardRouteParams>;
  }
}