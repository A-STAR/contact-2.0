import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorPaymentComponent } from './payment.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorPaymentComponent
  ],
  declarations: [
    DebtorPaymentComponent
  ],
})
export class DebtorPaymentModule {}
