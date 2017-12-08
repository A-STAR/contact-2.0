import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-contact-log-tab',
  templateUrl: './contact-log-tab.component.html'
})
export class DebtorContactLogTabComponent {
  static COMPONENT_NAME = 'DebtorContactLogTabComponent';

  private routeParams = (this.route.params as BehaviorSubject<any>).value;

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get contactId(): number {
    return this.routeParams.contactLogId;
  }

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get contactLogType(): number {
    return this.routeParams.contactLogType;
  }
}
