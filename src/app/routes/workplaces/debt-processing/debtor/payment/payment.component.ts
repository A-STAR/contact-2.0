import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-debtor-payment',
  templateUrl: './payment.component.html'
})
export class DebtorPaymentComponent {
  static COMPONENT_NAME = 'DebtorPaymentComponent';

  constructor(
    private route: ActivatedRoute,
  ) {}

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get paymentId(): number {
    return this.routeParams.paymentId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
