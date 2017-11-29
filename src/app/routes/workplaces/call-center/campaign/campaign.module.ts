import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressModule } from './address/address.module';
import { AddressesModule } from './addresses/addresses.module';
import { ContactModule } from './contact/contact.module';
import { ContactsModule } from './contacts/contacts.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DocumentModule } from './document/document.module';
import { DocumentsModule } from './documents/documents.module';
import { OverviewModule } from './overview/overview.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentsModule } from './payments/payments.module';
import { PhoneModule } from './phone/phone.module';
import { PhonesModule } from './phones/phones.module';
import { PromiseModule } from './promise/promise.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ToolbarModule } from './toolbar/toolbar.module';

import { AddressComponent } from './address/address.component';
import { CampaignComponent } from './campaign.component';
import { ContactComponent } from './contact/contact.component';
import { DocumentComponent } from './document/document.component';
import { PaymentComponent } from './payment/payment.component';
import { PhoneComponent } from './phone/phone.component';
import { PromiseComponent } from './promise/promise.component';

const routes: Routes = [
  { path: '', component: CampaignComponent },
  { path: 'phone', children: [
    { path: '', redirectTo: 'create', pathMatch: 'full' },
    { path: ':personId/create', component: PhoneComponent },
    { path: ':personId/:phoneId', component: PhoneComponent },
  ]},
  { path: 'address', children: [
    { path: '', redirectTo: 'create', pathMatch: 'full' },
    { path: ':personId/create', component: AddressComponent },
    { path: ':personId/:addressId', component: AddressComponent },
  ]},
  { path: 'contactLog', children: [
    { path: ':contactId/contactLogType/:contactType', component: ContactComponent },
  ]},
  { path: 'document', children: [
    { path: '', redirectTo: 'create', pathMatch: 'full' },
    { path: 'create', component: DocumentComponent },
    { path: ':documentId', component: DocumentComponent },
  ]},
  { path: 'promise', children: [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: ':debtId/:promiseId', component: PromiseComponent },
  ]},
  { path: 'payment', children: [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: ':debtId/:paymentId', component: PaymentComponent },
  ]},
];

@NgModule({
  imports: [
    AddressModule,
    AddressesModule,
    ContactModule,
    ContactsModule,
    DebtComponentsModule,
    DocumentModule,
    DocumentsModule,
    OverviewModule,
    PaymentModule,
    PaymentsModule,
    PhoneModule,
    PhonesModule,
    PromiseModule,
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
