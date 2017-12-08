import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-promise',
  templateUrl: './promise.component.html'
})
export class DebtorPromiseComponent {
  static COMPONENT_NAME = 'DebtorPromiseComponent';

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get promiseId(): number {
    return this.routeParams.promiseId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
