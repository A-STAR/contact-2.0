import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-call-center-payment',
  templateUrl: 'payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  static COMPONENT_NAME = 'DebtorPaymentComponent';
}
