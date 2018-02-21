import { NgModule } from '@angular/core';

import { AddressModule } from './address/address.module';
import { ContactRegistrationModule } from './contact-registration/contact-registration.module';
import { DebtComponentModule } from './debt-component/debt-component.module';
import { DocumentModule } from './documents/document.module';
import { PhoneModule } from './phone/phone.module';

@NgModule({
  imports: [
    AddressModule,
    ContactRegistrationModule,
    DebtComponentModule,
    DocumentModule,
    PhoneModule,
  ],
  exports: [
    AddressModule,
    ContactRegistrationModule,
    DebtComponentModule,
    DocumentModule,
    PhoneModule,
  ],
})
export class WorkplacesSharedModule {}
