import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactLogTabModule } from './contact-log-tab/contact-log-tab.module';
import { GridModule } from '../../../shared/components/grid/grid.module';
import { SharedModule } from '../../../shared/shared.module';

import { DebtorAddressModule } from './address/address.module';
import { DebtorAttributesModule } from './attributes/attributes.module';
import { DebtorContactsModule } from './contacts/contacts.module';
import { DebtorDebtComponentModule } from './debt-component/debt-component.module';
import { DebtorDebtModule } from './debt/debt.module';
import { DebtorDocumentModule } from './document/document.module';
import { DebtorEmailModule } from './email/email.module';
import { DebtorEmploymentModule } from './employment/employment.module';
import { DebtorGuarantorModule } from './guarantor/guarantor.module';
import { DebtorIdentityModule } from './identity/identity.module';
import { DebtorPaymentModule } from './payment/payment.module';
import { DebtorPhoneModule } from './phone/phone.module';
import { DebtorPledgeAttributesModule } from './pledge-attributes/pledge-attributes.module';
import { DebtorPledgeModule } from './pledge/pledge.module';
import { DebtorPromiseModule } from './promise/promise.module';
import { DebtorPropertyAttributesModule } from './property-attributes/property-attributes.module';
import { DebtorPropertyModule } from './property/property.module';
import { DebtsModule } from './debts/debts.module';
import { InformationModule } from './information/information.module';
import { RegisterContactModule } from './register-contact/register-contact.module';

import { DebtorService } from './debtor.service';

import { DebtorAddressComponent } from './address/address.component';
import { DebtorComponent } from './debtor.component';
import { DebtorContactLogTabComponent } from './contact-log-tab/contact-log-tab.component';
import { DebtorContactsComponent } from './contacts/contacts.component';
import { DebtorDebtComponent } from './debt/debt.component';
import { DebtorDebtComponentComponent } from './debt-component/debt-component.component';
import { DebtorDocumentComponent } from './document/document.component';
import { DebtorEmailComponent } from './email/email.component';
import { DebtorEmploymentComponent } from './employment/employment.component';
import { DebtorGuarantorComponent } from './guarantor/guarantor.component';
import { DebtorIdentityComponent } from './identity/identity.component';
import { DebtorPaymentComponent } from './payment/payment.component';
import { DebtorPhoneComponent } from './phone/phone.component';
import { DebtorPledgeComponent } from './pledge/pledge.component';
import { DebtorPromiseComponent } from './promise/promise.component';
import { DebtorPropertyComponent } from './property/property.component';

const routes: Routes = [
  {
    path: ':personId',
    children: [
      {
        path: '', component: DebtorComponent,
      },
      {
        path: 'guarantee',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorGuarantorComponent },
          { path: ':contractId/guarantor/add', component: DebtorGuarantorComponent },
          { path: ':contractId/guarantor/:guarantorId', component: DebtorGuarantorComponent },
        ],
      },
      {
        path: 'property',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorPropertyComponent },
          { path: ':propertyId', component: DebtorPropertyComponent },
        ],
      },
      {
        path: 'contactLog',
        children: [
          // { path: '', redirectTo: '..', pathMatch: 'full' },
          { path: ':contactLogId/contactLogType/:contactLogType', component: DebtorContactLogTabComponent },
        ]
      },
      {
        path: 'pledge',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorPledgeComponent },
          { path: ':contractId/pledgor/add', component: DebtorPledgeComponent },
          { path: ':contractId/pledgor/:pledgorId/:propertyId', component: DebtorPledgeComponent },
        ]
      },
      {
        path: 'contact',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorContactsComponent },
          {
            path: ':contactId',
            children: [
              { path: '', component: DebtorContactsComponent },
              {
                path: 'phone',
                children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorPhoneComponent },
                  { path: ':phoneId', component: DebtorPhoneComponent },
                ]
              },
              {
                path: 'address',
                children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorAddressComponent },
                  { path: ':addressId', component: DebtorAddressComponent },
                ]
              },
              {
                path: 'identity',
                children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorIdentityComponent },
                  { path: ':identityId', component: DebtorIdentityComponent },
                ]
              },
              {
                path: 'employment',
                children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorEmploymentComponent },
                  { path: ':employmentId', component: DebtorEmploymentComponent },
                ]
              },
            ]
          },
        ]
      },
      {
        path: 'document',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorDocumentComponent },
          { path: ':documentId', component: DebtorDocumentComponent },
        ]
      },
      {
        path: 'address',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorAddressComponent },
          { path: ':addressId', component: DebtorAddressComponent },
        ]
      },
      {
        path: 'email',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorEmailComponent },
          { path: ':emailId', component: DebtorEmailComponent },
        ]
      },
      {
        path: 'employment',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorEmploymentComponent },
          { path: ':employmentId', component: DebtorEmploymentComponent },
        ]
      },
      {
        path: 'identity',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorIdentityComponent },
          { path: ':identityId', component: DebtorIdentityComponent },
        ]
      },
      {
        path: 'phone',
        children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorPhoneComponent },
          { path: ':phoneId', component: DebtorPhoneComponent },
        ]
      },
      {
        path: 'debt',
        children: [
          { path: '', component: DebtorDebtComponent },
          { path: 'create', component: DebtorDebtComponent },
          {
            path: 'debt-component',
            children: [
              { path: '', redirectTo: '', pathMatch: 'full' },
              { path: 'create', component: DebtorDebtComponentComponent },
              { path: ':debtComponentId', component: DebtorDebtComponentComponent },
            ]
          },
          {
            path: 'promise',
            children: [
              { path: '', redirectTo: '', pathMatch: 'full' },
              { path: 'create', component: DebtorPromiseComponent },
              { path: ':promiseId', component: DebtorPromiseComponent },
            ]
          },
          {
            path: 'payment',
            children: [
              { path: '', redirectTo: '', pathMatch: 'full' },
              { path: 'create', component: DebtorPaymentComponent },
              { path: ':paymentId', component: DebtorPaymentComponent },
            ]
          }
        ]
      },
    ],
  },
];

@NgModule({
  imports: [
    ContactLogTabModule,
    DebtorAddressModule,
    DebtorAttributesModule,
    DebtorContactsModule,
    DebtorDebtComponentModule,
    DebtorDebtModule,
    DebtorDocumentModule,
    DebtorEmailModule,
    DebtorEmploymentModule,
    DebtorGuarantorModule,
    DebtorIdentityModule,
    DebtorPaymentModule,
    DebtorPhoneModule,
    DebtorPledgeAttributesModule,
    DebtorPledgeModule,
    DebtorPromiseModule,
    DebtorPropertyAttributesModule,
    DebtorPropertyModule,
    DebtsModule,
    GridModule,
    InformationModule,
    RegisterContactModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    DebtorService,
  ]
})
export class DebtorCardModule { }
