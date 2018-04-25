import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-payment',
  templateUrl: './debtor-payment.component.html'
})
export class DebtorPaymentComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$;
  }

  get paymentId(): number {
    return this.routeParams.paymentId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
