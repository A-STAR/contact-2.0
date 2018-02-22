import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactLogTabModule } from './contact-log-tab/contact-log-tab.module';
import { GridModule } from '../../../shared/components/grid/grid.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactPersonsModule } from './contact-persons/contact-persons.module';
import { DebtModule } from './debt/debt.module';
import { DebtorActionLogModule } from './action-log/action-log.module';
import { DebtorAddressModule } from './address/address.module';
import { DebtorAttributesModule } from './attributes/attributes.module';
import { DebtorAttributesVersionsModule } from './versions/debtor-attributes-versions.module';
import { DebtorDebtComponentModule } from './debt-component/debt-component.module';
import { DebtorDocumentModule } from './document/document.module';
import { DebtorEmploymentModule } from './employment/employment.module';
import { DebtorGuaranteeModule } from './guarantee/guarantee.module';
import { DebtorIdentityModule } from './identity/identity.module';
import { DebtorPaymentModule } from './payment/payment.module';
import { DebtorPhoneModule } from './phone/phone.module';
import { DebtorPledgeAttributesModule } from './pledge/attributes/pledge-attributes.module';
import { DebtorPledgeModule } from './pledge/pledge.module';
import { DebtorPromiseModule } from './promise/promise.module';
import { DebtorPropertyAttributesModule } from './property/attributes/property-attributes.module';
import { DebtorPropertyModule } from './property/property.module';
import { DebtsModule } from './debts/debts.module';
import { InformationModule } from './information/information.module';
import { RegisterContactModule } from './register-contact/register-contact.module';
import { WorkplacesSharedModule } from '../shared/shared.module';

import { DebtorService } from './debtor.service';

import { DebtComponent } from './debt/debt.component';
import { DebtorAddressComponent } from './address/address.component';
import { DebtorAttributesVersionsComponent } from './versions/debtor-attributes-versions.component';
import { DebtorComponent } from './debtor.component';
import { DebtorContactLogTabComponent } from './contact-log-tab/contact-log-tab.component';
import { ContactPersonsComponent } from './contact-persons/contact-persons.component';
import { DebtorDebtComponentComponent } from './debt-component/debt-component.component';
import { DebtorDocumentComponent } from './document/document.component';
import { DebtorEmailCardComponent } from './information/email/card/email-card.component';
import { DebtorEmploymentComponent } from './employment/employment.component';
import { DebtorGuaranteeCardComponent } from './guarantee/card/guarantee-card.component';
import { DebtorIdentityComponent } from './identity/identity.component';
import { DebtorPaymentComponent } from './payment/payment.component';
import { DebtorPhoneComponent } from './phone/phone.component';
import { DebtorPledgeCardComponent } from './pledge/card/pledge-card.component';
import { DebtorPromiseComponent } from './promise/promise.component';
import { DebtorPropertyCardComponent } from './property/card/property-card.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'guarantee',
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorGuaranteeCardComponent },
      { path: ':contractId/guarantor/add', component: DebtorGuaranteeCardComponent },
      { path: ':contractId/guarantor/:guarantorId', component: DebtorGuaranteeCardComponent },
    ],
  },
  {
    path: 'property',
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorPropertyCardComponent },
      { path: ':propertyId', component: DebtorPropertyCardComponent },
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
      { path: 'create', component: DebtorPledgeCardComponent },
      { path: ':contractId/pledgor/add', component: DebtorPledgeCardComponent },
      { path: ':contractId/pledgor/:pledgorId/:propertyId', component: DebtorPledgeCardComponent },
    ]
  },
  {
    path: 'contact',
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      {
        path: 'create',
        children: [
          { path: '', component: ContactPersonsComponent, data: {reuse: true} },
          {
            path: ':contactPersonId',
            children: [
              { path: '', component: ContactPersonsComponent },
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
          }
        ]
      },
      {
        path: ':contactId',
        children: [
          { path: '', component: ContactPersonsComponent },
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
      { path: 'create', component: DebtorEmailCardComponent },
      { path: ':emailId', component: DebtorEmailCardComponent },
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
      { path: '', component: DebtComponent },
      { path: 'create', component: DebtComponent },
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
  {
    path: ':attributeId/versions', component: DebtorAttributesVersionsComponent
  }
];

@NgModule({
  imports: [
    ContactLogTabModule,
    DebtModule,
    DebtorActionLogModule,
    DebtorAddressModule,
    DebtorAttributesModule,
    DebtorAttributesVersionsModule,
    ContactPersonsModule,
    DebtorDebtComponentModule,
    DebtorDocumentModule,
    DebtorEmploymentModule,
    DebtorGuaranteeModule,
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
    WorkplacesSharedModule,
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
