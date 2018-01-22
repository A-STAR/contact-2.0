import { NgModule } from '@angular/core';

import { AddressModule } from './address/address.module';
import { ContactRegistrationModule } from './contact-registration/contact-registration.module';
import { PhoneModule } from './phone/phone.module';

@NgModule({
  imports: [
    AddressModule,
    ContactRegistrationModule,
    PhoneModule,
  ],
  exports: [
    AddressModule,
    ContactRegistrationModule,
    PhoneModule,
  ],
})
export class WorkplacesSharedModule {}
