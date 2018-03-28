import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularSplitModule } from 'angular-split';

import { AddressesModule } from './addresses/addresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DebtModule } from './debt/debt.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentsModule } from './payments/payments.module';
import { PersonModule } from './person/person.module';
import { PhonesModule } from './phones/phones.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '@app/shared/shared.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { CampaignLayoutComponent } from './campaign-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignLayoutComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    AddressesModule,
    AngularSplitModule,
    ContactsModule,
    DebtComponentsModule,
    DebtModule,
    DocumentsModule,
    PaymentsModule,
    PersonModule,
    PhonesModule,
    PromisesModule,
    RouterModule.forChild(routes),
    SharedModule,
    ToolbarModule,
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    CampaignLayoutComponent,
  ]
})
export class CampaignLayoutModule {}
