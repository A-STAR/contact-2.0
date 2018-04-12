import { NgModule } from '@angular/core';

import { AddressModule } from './address/address.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { ContactRegistrationModule } from './contact-registration/contact-registration.module';
import { DebtComponentModule } from './debt-component/debt-component.module';
import { DocumentModule } from './documents/document.module';
import { EmploymentGridModule } from './employment/grid/employment-grid.module';
import { IdentityGridModule } from './identity/grid/identity-grid.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';

@NgModule({
  imports: [
    AddressModule,
    ContactLogModule,
    ContactRegistrationModule,
    DebtComponentModule,
    DocumentModule,
    EmploymentGridModule,
    IdentityGridModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ],
  exports: [
    AddressModule,
    ContactLogModule,
    ContactRegistrationModule,
    DebtComponentModule,
    DocumentModule,
    EmploymentGridModule,
    IdentityGridModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ],
})
export class WorkplacesSharedModule {}
