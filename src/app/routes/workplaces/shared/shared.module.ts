import { NgModule } from '@angular/core';

import { AddressGridModule } from './address/grid/address-grid.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { ContactRegistrationModule } from './contact-registration/contact-registration.module';
import { DebtComponentModule } from './debt-component/debt-component.module';
import { DocumentGridModule } from './documents/grid/document-grid.module';
import { EmailGridModule } from './email/grid/email-grid.module';
import { EmploymentGridModule } from './employment/grid/employment-grid.module';
import { IdentityGridModule } from './identity/grid/identity-grid.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneGridModule } from './phone/grid/phone-grid.module';
import { PromiseModule } from './promise/promise.module';

@NgModule({
  imports: [
    AddressGridModule,
    ContactLogModule,
    ContactRegistrationModule,
    DebtComponentModule,
    DocumentGridModule,
    EmailGridModule,
    EmploymentGridModule,
    IdentityGridModule,
    PaymentModule,
    PhoneGridModule,
    PromiseModule,
  ],
  exports: [
    AddressGridModule,
    ContactLogModule,
    ContactRegistrationModule,
    DebtComponentModule,
    DocumentGridModule,
    EmailGridModule,
    EmploymentGridModule,
    IdentityGridModule,
    PaymentModule,
    PhoneGridModule,
    PromiseModule,
  ],
})
export class WorkplacesSharedModule {}
