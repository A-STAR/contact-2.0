import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressesModule } from './addresses/addresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DocumentsModule } from './documents/documents.module';
import { OverviewModule } from './overview/overview.module';
import { PaymentsModule } from './payments/payments.module';
import { PhonesModule } from './phones/phones.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '../../../../shared/shared.module';

import { CampaignComponent } from './campaign.component';

const routes: Routes = [
  { path: '', component: CampaignComponent },
];

@NgModule({
  imports: [
    AddressesModule,
    ContactsModule,
    DebtComponentsModule,
    DocumentsModule,
    OverviewModule,
    PaymentsModule,
    PhonesModule,
    PromisesModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    CampaignComponent,
  ]
})
export class CampaignModule {}
