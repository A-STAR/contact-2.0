import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { Observable } from 'rxjs/Observable';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debtor-debts',
  templateUrl: 'debts.component.html',
})
export class DebtsComponent {
  tabs = [
    { isInitialised: true },
    { isInitialised: true },
  ];

  constructor(
    private debtorCardService: DebtorCardService,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get debtStatusCode$(): Observable<number> {
    return this.debtorCardService.selectedDebt$.map(debt => debt && debt.statusCode);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
