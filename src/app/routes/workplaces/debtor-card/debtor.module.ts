import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorActionLogModule } from './action-log/action-log.module';
import { DebtorAttributesModule } from './attributes/attributes.module';
import { GuaranteeGridModule } from './guarantee/grid/guarantee-grid.module';
import { DebtorPledgeAttributesModule } from './pledge/attributes/pledge-attributes.module';
import { PledgeGridModule } from './pledge/grid/pledge-grid.module';
import { DebtorPropertyAttributesModule } from './property/attributes/property-attributes.module';
import { PropertyGridModule } from './property/grid/property-grid.module';
import { DebtsModule } from './debts/debts.module';
import { InformationModule } from './information/information.module';
import { RegisterContactModule } from './register-contact/register-contact.module';
import { WorkplacesSharedModule } from '../shared/shared.module';

import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: './debtor-card-layout/debtor-card-layout.module#DebtorCardLayoutModule',
      },
      {
        path: 'guarantee/create',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
      },
      {
        path: 'guarantee/:contractId/guarantor/add',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
      },
      {
        path: 'property/create',
        loadChildren: './property/card/property-card.module#PropertyCardModule',
      },
      {
        path: 'property/:propertyId',
        loadChildren: './property/card/property-card.module#PropertyCardModule',
      },
      {
        path: 'contactLog/:contactLogId/contactLogType/:contactLogType',
        loadChildren: './contact-log-tab/contact-log-tab.module#ContactLogTabModule',
      },
      {
        path: 'pledge/create',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/add',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/:propertyId',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'contact/create',
        loadChildren: './contact-persons/contact-persons.module#ContactPersonsModule',
      },
      {
        path: 'contact/create/:contactPersonId',
        loadChildren: './contact-persons/contact-persons.module#ContactPersonsModule',
      },
      {
        path: 'contact/create/:contactPersonId/phone/create',
        loadChildren: './phone/phone.module#DebtorPhoneModule',
      },
      {
        path: 'contact/create/:contactPersonId/phone/:phoneId',
        loadChildren: './phone/phone.module#DebtorPhoneModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/phone/create',
        loadChildren: './phone/phone.module#DebtorPhoneModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/phone/:phoneId',
        loadChildren: './phone/phone.module#DebtorPhoneModule',
      },
      {
        path: 'contact/create/:contactPersonId/address/create',
        loadChildren: './address/address.module#DebtorAddressModule',
      },
      {
        path: 'contact/create/:contactPersonId/address/:addressId',
        loadChildren: './address/address.module#DebtorAddressModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/address/create',
        loadChildren: './address/address.module#DebtorAddressModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/address/:addressId',
        loadChildren: './address/address.module#DebtorAddressModule',
      },
      {
        path: 'contact/create/:contactPersonId/identity/create',
        loadChildren: './identity/identity.module#IdentityModule',
      },
      {
        path: 'contact/create/:contactPersonId/identity/:identityId',
        loadChildren: './identity/identity.module#IdentityModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/identity/create',
        loadChildren: './identity/identity.module#IdentityModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/identity/:identityId',
        loadChildren: './identity/identity.module#IdentityModule',
      },
      {
        path: 'contact/create/:contactPersonId/employment/create',
        loadChildren: './employment/employment.module#EmploymentModule',
      },
      {
        path: 'contact/create/:contactPersonId/employment/:employmentId',
        loadChildren: './employment/employment.module#EmploymentModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/employment/create',
        loadChildren: './employment/employment.module#EmploymentModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/employment/:employmentId',
        loadChildren: './employment/employment.module#EmploymentModule',
      },
      {
        path: 'document/create',
        loadChildren: './document/document.module#DocumentModule',
      },
      {
        path: 'document/:documentId',
        loadChildren: './document/document.module#DocumentModule',
      },
      {
        path: 'address/create',
        loadChildren: './address/address.module#DebtorAddressModule',
      },
      {
        path: 'address/:addressId',
        loadChildren: './address/address.module#DebtorAddressModule',
      },
      {
        path: 'email/create',
        loadChildren: './information/email/email.module#EmailModule',
      },
      {
        path: 'email/:emailId',
        loadChildren: './information/email/email.module#EmailModule',
      },
      {
        path: 'employment/create',
        loadChildren: './employment/employment.module#EmploymentModule',
      },
      {
        path: 'employment/:employmentId',
        loadChildren: './employment/employment.module#EmploymentModule',
      },
      {
        path: 'identity/create',
        loadChildren: './identity/identity.module#IdentityModule',
      },
      {
        path: 'identity/:identityId',
        loadChildren: './identity/identity.module#IdentityModule',
      },
      {
        path: 'phone/create',
        loadChildren: './phone/phone.module#DebtorPhoneModule',
      },
      {
        path: 'phone/:phoneId',
        loadChildren: './phone/phone.module#DebtorPhoneModule',
      },
      {
        path: 'debt/create',
        loadChildren: './debt/debt.module#DebtModule',
      },
      {
        path: 'debt/debt-component/create',
        loadChildren: './debt-component/debt-component.module#DebtComponentModule',
      },
      {
        path: 'debt/debt-component/:debtComponentId',
        loadChildren: './debt-component/debt-component.module#DebtComponentModule',
      },
      {
        path: 'debt/promise/create',
        loadChildren: './promise/promise.module#DebtorPromiseModule',
      },
      {
        path: 'debt/promise/:promiseId',
        loadChildren: './promise/promise.module#DebtorPromiseModule',
      },
      {
        path: 'debt/payment/create',
        loadChildren: './payment/payment.module#DebtorPaymentModule',
      },
      {
        path: 'debt/payment/:paymentId',
        loadChildren: './payment/payment.module#DebtorPaymentModule',
      },
      {
        path: ':attributeId/versions',
        loadChildren: './versions/debtor-attributes-versions.module#DebtorAttributesVersionsModule',
      },
    ]
  },
];

@NgModule({
  imports: [
    DebtorActionLogModule,
    DebtorAttributesModule,
    GuaranteeGridModule,
    DebtorPledgeAttributesModule,
    PledgeGridModule,
    DebtorPropertyAttributesModule,
    PropertyGridModule,
    DebtsModule,
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
export class DebtorCardModule {}
