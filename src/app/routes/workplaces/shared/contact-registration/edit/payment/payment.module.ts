import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PaymentService } from './payment.service';

import { PaymentComponent } from './payment.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PaymentComponent,
  ],
  declarations: [
    PaymentComponent,
  ],
  providers: [
    PaymentService,
  ]
})
export class PaymentModule {}
