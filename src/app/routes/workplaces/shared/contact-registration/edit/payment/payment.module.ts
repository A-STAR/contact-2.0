import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
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
    SelectModule,
    SharedModule,
  ],
})
export class ContactRegistrationPaymentModule {}
