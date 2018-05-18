import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

@Component({
  selector: 'app-contact-log-tab',
  templateUrl: './contact-log-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorContactLogTabComponent {

  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
  ) {}

  get contactId(): number {
    return Number(this.route.snapshot.paramMap.get('contactLogId'));
  }

  readonly debtId$ = this.debtorService.debtId$;

  get contactLogType(): number {
    return Number(this.route.snapshot.paramMap.get('contactLogType'));
  }
}
