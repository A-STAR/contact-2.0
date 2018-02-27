import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationPaymentComponent } from './payment.component';

@NgModule({
  declarations: [
    ContactRegistrationPaymentComponent,
  ],
  exports: [
    ContactRegistrationPaymentComponent,
  ],
  imports: [
    SharedModule,
  ],
})
export class ContactRegistrationPaymentModule {}
