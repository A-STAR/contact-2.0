import { NgModule } from '@angular/core';

import { ContactPersonsModule } from './contact-persons/contact-persons.module';
import { DebtsModule } from './debts/debts.module';
import { GuaranteeModule } from './guarantee/guarantee.module';
import { GuarantorModule } from './guarantor/guarantor.module';
import { IdentityModule } from './identity/identity.module';
import { PledgeModule } from './pledge/pledge.module';
import { PledgorModule } from './pledgor/pledgor.module';
import { PledgorPropertyModule } from './pledgor-property/pledgor-property.module';
import { PromiseModule } from './promise/promise.module';
import { PropertyModule } from './property/property.module';

@NgModule({
  imports: [
    ContactPersonsModule,
    DebtsModule,
    GuaranteeModule,
    GuarantorModule,
    IdentityModule,
    PledgeModule,
    PledgorModule,
    PledgorPropertyModule,
    PromiseModule,
    PropertyModule,
  ],
})
export class WorkplacesCoreModule {}
