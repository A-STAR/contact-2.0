import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

@Component({
  selector: 'app-debtor-payment',
  templateUrl: './debtor-payment.component.html'
})
export class DebtorPaymentComponent {
  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorService.debtId$;
  }

  get paymentId(): number {
    return this.routeParams.paymentId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
