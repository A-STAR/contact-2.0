import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentCardModule } from './card/payment-card.module';
import { PaymentGridModule } from './grid/payment-grid.module';

import { PaymentService } from './payment.service';

@NgModule({
  imports: [
    PaymentCardModule,
    PaymentGridModule,
    CommonModule,
  ],
  exports: [
    PaymentCardModule,
    PaymentGridModule,
  ],
  providers: [
    PaymentService,
  ]
})
export class PaymentModule {}
