import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debtor-debts',
  templateUrl: 'debts.component.html',
})
export class DebtsComponent {
  tabs = [
    {
      isInitialised: true,
      permission: this.userPermissionsService.has('PAYMENT_VIEW')
    },
    {
      isInitialised: true,
      permission: this.userPermissionsService.has('PROMISE_VIEW')
    },
  ];

  constructor(
    private debtorService: DebtorService,
    private userPermissionsService: UserPermissionsService
  ) {}

  readonly debtId$: Observable<number> = this.debtorService.debtId$;

  readonly debtStatusCode$: Observable<number> = this.debtorService.debt$
    .pipe(
      map(debt => debt && debt.statusCode)
    );

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
