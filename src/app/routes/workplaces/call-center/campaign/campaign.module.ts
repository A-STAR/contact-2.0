import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularSplitModule } from 'angular-split';

import { AddressModule } from './address/address.module';
import { AddressesModule } from './addresses/addresses.module';
import { ContactModule } from './contact/contact.module';
import { ContactsModule } from './contacts/contacts.module';
import { DebtComponentsModule } from './debt-components/debt-components.module';
import { DebtModule } from './debt/debt.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentsModule } from './payments/payments.module';
import { PersonModule } from './person/person.module';
import { PhoneModule } from './phone/phone.module';
import { PhonesModule } from './phones/phones.module';
import { PromiseModule } from './promise/promise.module';
import { PromisesModule } from './promises/promises.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { AddressComponent } from './address/address.component';
import { CampaignComponent } from './campaign.component';
import { ContactComponent } from './contact/contact.component';
import { PaymentComponent } from './payment/payment.component';
import { PhoneComponent } from './phone/phone.component';
import { PromiseComponent } from './promise/promise.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignComponent,
    data: {
      reuse: true,
    },
  },
  { path: 'phone', children: [
    { path: ':personId/create', component: PhoneComponent },
    { path: ':personId/:phoneId', component: PhoneComponent },
  ]},
  { path: 'address', children: [
    { path: ':personId/create', component: AddressComponent },
    { path: ':personId/:addressId', component: AddressComponent },
  ]},
  { path: 'contactLog', children: [
    { path: ':debtId/:contactId/contactLogType/:contactType', component: ContactComponent },
  ]},
  { path: 'promise', children: [
    { path: ':debtId/:promiseId', component: PromiseComponent },
  ]},
  { path: 'payment', children: [
    { path: ':debtId/:paymentId', component: PaymentComponent },
  ]},
];

@NgModule({
  imports: [
    AddressModule,
    AddressesModule,
    AngularSplitModule,
    ContactModule,
    ContactsModule,
    DebtComponentsModule,
    DebtModule,
    DocumentsModule,
    PaymentModule,
    PaymentsModule,
    PersonModule,
    PhoneModule,
    PhonesModule,
    PromiseModule,
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
    CampaignComponent,
  ]
})
export class CampaignModule {}
