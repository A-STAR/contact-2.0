import { NgModule } from '@angular/core';

import { ContactPersonsModule } from './contact-persons/contact-persons.module';
import { DebtsModule } from './debts/debts.module';
import { PledgeModule } from './pledge/pledge.module';
import { PledgorModule } from './pledgor/pledgor.module';
import { PledgorPropertyModule } from './pledgor-property/pledgor-property.module';
import { PromiseModule } from './promise/promise.module';
import { PropertyModule } from './property/property.module';

@NgModule({
  imports: [
    ContactPersonsModule,
    DebtsModule,
    PledgeModule,
    PledgorModule,
    PledgorPropertyModule,
    PromiseModule,
    PropertyModule,
  ],
})
export class WorkplacesCoreModule {}
