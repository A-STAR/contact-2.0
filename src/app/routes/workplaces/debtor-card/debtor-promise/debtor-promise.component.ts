import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-promise',
  templateUrl: './debtor-promise.component.html'
})
export class DebtorPromiseComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get promiseId(): number {
    return Number(this.route.snapshot.paramMap.get('promiseId'));
  }

}
