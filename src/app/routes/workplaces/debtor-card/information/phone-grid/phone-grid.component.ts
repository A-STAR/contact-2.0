import { Component } from '@angular/core';

import { DebtorCardService } from '../../../../../core/app-modules/debtor-card/debtor-card.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-debtor-information-phone-grid',
  templateUrl: 'phone-grid.component.html'
})
export class PhoneGridComponent {
  constructor(
    private debtorCardService: DebtorCardService,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get personId$(): Observable<number> {
    return this.debtorCardService.personId$;
  }
}
