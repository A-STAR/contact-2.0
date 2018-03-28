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

// import { DebtComponent } from './debt/debt.component';
// import { DebtorAddressComponent } from './address/address.component';
// import { DebtorAttributesVersionsComponent } from './versions/debtor-attributes-versions.component';
import { DebtorComponent } from './debtor.component';
// import { DebtorContactLogTabComponent } from './contact-log-tab/contact-log-tab.component';
// import { ContactPersonsComponent } from './contact-persons/contact-persons.component';
// import { DebtorDebtComponentComponent } from './debt-component/debt-component.component';
// import { DebtorDocumentComponent } from './document/document.component';
// import { DebtorEmailCardComponent } from './information/email/card/email-card.component';
// import { DebtorEmploymentComponent } from './employment/employment.component';
// import { DebtorGuaranteeCardComponent } from './guarantee/card/guarantee-card.component';
// import { DebtorIdentityComponent } from './identity/identity.component';
// import { DebtorPaymentComponent } from './payment/payment.component';
// import { DebtorPhoneComponent } from './phone/phone.component';
// import { DebtorPledgeCardComponent } from './pledge/card/pledge-card.component';
// import { DebtorPromiseComponent } from './promise/promise.component';
// import { DebtorPropertyCardComponent } from './property/card/property-card.component';

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
        loadChildren: './debtor-card-layout/debtor-card-layout.module#DebtorCardLayout',
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
        loadChildren: './phone/phone.module#PhoneModule',
      },
      {
        path: 'contact/create/:contactPersonId/phone/:phoneId',
        loadChildren: './phone/phone.module#PhoneModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/phone/create',
        loadChildren: './phone/phone.module#PhoneModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/phone/:phoneId',
        loadChildren: './phone/phone.module#PhoneModule',
      },
      {
        path: 'contact/create/:contactPersonId/address/create',
        loadChildren: './address/address.module#AddressModule',
      },
      {
        path: 'contact/create/:contactPersonId/address/:addressId',
        loadChildren: './address/address.module#AddressModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/address/create',
        loadChildren: './address/address.module#AddressModule',
      },
      {
        path: 'contact/:contactId/:contactPersonId/address/:addressId',
        loadChildren: './address/address.module#AddressModule',
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
        loadChildren: './address/address.module#AddressModule',
      },
      {
        path: 'address/:addressId',
        loadChildren: './address/address.module#AddressModule',
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
        loadChildren: './phone/phone.module#PhoneModule',
      },
      {
        path: 'phone/:phoneId',
        loadChildren: './phone/phone.module#PhoneModule',
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
        loadChildren: './promise/promise.module#PromiseModule',
      },
      {
        path: 'debt/promise/:promiseId',
        loadChildren: './promise/promise.module#PromiseModule',
      },
      {
        path: 'debt/payment/create',
        loadChildren: './payment/payment.module#PaymentModule',
      },
      {
        path: 'debt/payment/:paymentId',
        loadChildren: './payment/payment.module#PaymentModule',
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
export class DebtorCardModule {}
