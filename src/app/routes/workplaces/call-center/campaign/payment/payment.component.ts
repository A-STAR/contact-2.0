import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-call-center-payment',
  templateUrl: 'payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get debtId(): Observable<number> {
    return this.routeParams.debtId;
  }

  get paymentId(): number {
    return this.routeParams.paymentId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
