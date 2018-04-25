import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-contact-log-tab',
  templateUrl: './contact-log-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorContactLogTabComponent {

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get contactId(): number {
    return Number(this.route.snapshot.paramMap.get('contactLogId'));
  }

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get contactLogType(): number {
    return Number(this.route.snapshot.paramMap.get('contactLogType'));
  }
}
