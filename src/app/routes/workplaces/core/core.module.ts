import { NgModule } from '@angular/core';

import { AddressModule } from './address/address.module';
import { ContactPersonsModule } from './contact-persons/contact-persons.module';
import { DebtsModule } from './debts/debts.module';
import { DebtorEmploymentModule } from './employment/employment.module';
import { GuaranteeModule } from './guarantee/guarantee.module';
import { GuarantorModule } from './guarantor/guarantor.module';
import { IdentityModule } from './identity/identity.module';
import { PhoneModule } from './phone/phone.module';
import { PledgeModule } from './pledge/pledge.module';
import { PledgorModule } from './pledgor/pledgor.module';
import { PledgorPropertyModule } from './pledgor-property/pledgor-property.module';
import { PromiseModule } from './promise/promise.module';
import { PropertyModule } from './property/property.module';

@NgModule({
  imports: [
    AddressModule,
    ContactPersonsModule,
    DebtsModule,
    DebtorEmploymentModule,
    GuaranteeModule,
    GuarantorModule,
    IdentityModule,
    PhoneModule,
    PledgeModule,
    PledgorModule,
    PledgorPropertyModule,
    PromiseModule,
    PropertyModule,
  ],
})
export class WorkplacesCoreModule {}
