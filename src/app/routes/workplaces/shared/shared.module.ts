import { NgModule } from '@angular/core';

import { AddressModule } from './address/address.module';
import { ContactRegistrationModule } from './contact-registration/contact-registration.module';
import { DocumentModule } from './documents/document.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';

@NgModule({
  imports: [
    AddressModule,
    ContactRegistrationModule,
    DocumentModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ],
  exports: [
    AddressModule,
    ContactRegistrationModule,
    DocumentModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ],
})
export class WorkplacesSharedModule {}
