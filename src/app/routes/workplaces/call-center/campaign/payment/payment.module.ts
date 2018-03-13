import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PaymentComponent } from './payment.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    PaymentComponent,
  ],
  declarations: [
    PaymentComponent,
  ],
})
export class PaymentModule {}
