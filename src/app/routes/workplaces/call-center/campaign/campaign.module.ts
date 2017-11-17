import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressModule } from './address/address.module';
import { AddressesModule } from './addresses/addresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DocumentsModule } from './documents/documents.module';
import { OverviewModule } from './overview/overview.module';
import { PaymentsModule } from './payments/payments.module';
import { PhoneModule } from './phone/phone.module';
import { PhonesModule } from './phones/phones.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ToolbarModule } from './toolbar/toolbar.module';

import { AddressComponent } from './address/address.component';
import { CampaignComponent } from './campaign.component';
import { PhoneComponent } from './phone/phone.component';

const routes: Routes = [
  { path: '', component: CampaignComponent },
  { path: 'phone', children: [
    { path: '', redirectTo: 'create', pathMatch: 'full' },
    { path: 'create', component: PhoneComponent },
    { path: ':phoneId', component: PhoneComponent },
  ]},
  { path: 'address', children: [
    { path: '', redirectTo: 'create', pathMatch: 'full' },
    { path: 'create', component: AddressComponent },
    { path: ':addressId', component: AddressComponent },
  ]},
];

@NgModule({
  imports: [
    AddressModule,
    AddressesModule,
    ContactsModule,
    DebtComponentsModule,
    DocumentsModule,
    OverviewModule,
    PaymentsModule,
    PhoneModule,
    PhonesModule,
    PromisesModule,
    RouterModule.forChild(routes),
    SharedModule,
    ToolbarModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    CampaignComponent,
  ]
})
export class CampaignModule {}
