import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
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
    private debtorService: DebtorService,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorService.debtId$;
  }

  get debtStatusCode$(): Observable<number> {
    return this.debtorService.debtId$.map(debt => debt && debt.statusCode);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
