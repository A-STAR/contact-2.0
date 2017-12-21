import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

interface IEmailCardRouteParams {
  emailId: number;
  contactId: number;
}

@Component({
  selector: 'app-debtor-email',
  templateUrl: './email.component.html'
})
export class DebtorEmailComponent {
  static COMPONENT_NAME = 'DebtorEmailComponent';

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get emailId$(): Observable<number> {
    return this.routeParams$.map(params => params.emailId);
  }

  get entityId$(): Observable<number> {
    return Observable
      .combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactId || personId);
  }

  get routeParams$(): Observable<IEmailCardRouteParams> {
    return this.route.params as Observable<IEmailCardRouteParams>;
  }
}
