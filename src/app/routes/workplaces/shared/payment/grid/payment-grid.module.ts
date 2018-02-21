import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PaymentGridComponent } from './payment-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PaymentGridComponent,
  ],
  declarations: [
    PaymentGridComponent,
  ]
})
export class PaymentGridModule {}
