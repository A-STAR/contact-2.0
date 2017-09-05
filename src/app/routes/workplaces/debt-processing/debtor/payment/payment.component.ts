import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { PaymentCardComponent } from '../../../../../shared/gui-objects/widgets/payment/card/payment-card.component';

@Component({
  selector: 'app-debtor-payment',
  templateUrl: './payment.component.html'
})
export class DebtorPaymentComponent {
  static COMPONENT_NAME = 'DebtorPaymentComponent';

  get node(): INode {
    return {
      component: PaymentCardComponent
    };
  }
}
