import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
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
        path: 'phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },
      {
        path: 'document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },
      {
        path: 'email/create',
        loadChildren: './information/email/card/email-card.module#EmailCardModule',
      },
      {
        path: 'email/:emailId',
        loadChildren: './information/email/card/email-card.module#EmailCardModule',
      },
      {
        path: 'employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'debt',
        loadChildren: './debt/debt.module#DebtModule',
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
        loadChildren: './debtor-promise/debtor-promise.module#DebtorPromiseModule',
      },
      {
        path: 'debt/promise/:promiseId',
        loadChildren: './debtor-promise/debtor-promise.module#DebtorPromiseModule',
      },
      {
        path: 'debt/payment/create',
        loadChildren: './debtor-payment/debtor-payment.module#DebtorPaymentModule',
      },
      {
        path: 'debt/payment/:paymentId',
        loadChildren: './debtor-payment/debtor-payment.module#DebtorPaymentModule',
      },
      {
        path: ':attributeId/versions',
        loadChildren: './versions/debtor-attributes-versions.module#DebtorAttributesVersionsModule',
      },

      // Guarantee
      {
        path: 'guarantee/create',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
        data: {
          edit: false,
          showContractForm: true,
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/create',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
        data: {
          edit: false,
          showContractForm: false,
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
        data: {
          edit: true,
          showContractForm: true,
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },
      {
        path: 'guarantee/:contractId/guarantor/:guarantorId/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },

      // Pledge
      {
        path: 'pledge/create',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/create',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/property/create',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/property/:propertyId',
        loadChildren: './pledge/card/pledge-card.module#PledgeCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/property/:propertyId/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/property/:propertyId/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/property/:propertyId/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/property/:propertyId/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'pledgorId',
        },
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },
      {
        path: 'pledge/:contractId/pledgor/:pledgorId/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },

      // Contact Persons:
      {
        path: 'contact/create',
        loadChildren: './contact-persons/card/contact-person-card.module#ContactPersonCardModule',
        data: {
          edit: false,
        },
      },
      {
        path: 'contact/:personId',
        loadChildren: './contact-persons/card/contact-person-card.module#ContactPersonCardModule',
        data: {
          edit: true,
        },
      },
      {
        path: 'contact/:personId/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'personId',
        },
      },
      {
        path: 'contact/:personId/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },
      {
        path: 'contact/:personId/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
      },
    ],
  },
];

@NgModule({
  imports: [
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
