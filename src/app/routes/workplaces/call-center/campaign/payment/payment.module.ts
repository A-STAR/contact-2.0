import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

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
})
export class PaymentModule { }
