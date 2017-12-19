import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-group-tab',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupCardComponent {
  static COMPONENT_NAME = 'GroupCardComponent';

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
