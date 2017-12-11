import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorPaymentComponent } from './payment.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorPaymentComponent
  ],
  declarations: [
    DebtorPaymentComponent
  ],
})
export class DebtorPaymentModule {}
