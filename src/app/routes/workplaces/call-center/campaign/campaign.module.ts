import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressesModule } from './addresses/addresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { DebtModule } from './debt/debt.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DebtorModule } from './debtor/debtor.module';
import { DocumentsModule } from './documents/documents.module';
import { MiscModule } from './misc/misc.module';
import { OverviewModule } from './overview/overview.module';
import { PaymentsModule } from './payments/payments.module';
import { PhonesModule } from './phones/phones.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '../../../../shared/shared.module';

import { CampaignComponent } from './campaign.component';

// const routes: Routes = [
//   { path: ':campaignId', component: CampaignComponent },
// ];

@NgModule({
  imports: [
    AddressesModule,
    ContactsModule,
    DebtModule,
    DebtComponentsModule,
    DebtorModule,
    DocumentsModule,
    MiscModule,
    OverviewModule,
    PaymentsModule,
    PhonesModule,
    PromisesModule,
    // RouterModule.forChild(routes),
    SharedModule,
  ],
  // exports: [
  //   RouterModule,
  // ],
  declarations: [
    CampaignComponent,
  ]
})
export class CampaignModule {}
