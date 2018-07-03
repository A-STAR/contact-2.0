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
        redirectTo: 'edit',
      },
      {
        path: 'edit',
        loadChildren: './debtor-card-layout/debtor-card-layout.module#DebtorCardLayoutModule',
      },
      {
        path: 'edit/property/create',
        loadChildren: './property/card/property-card.module#PropertyCardModule',
      },
      {
        path: 'edit/property/:propertyId',
        loadChildren: './property/card/property-card.module#PropertyCardModule',
      },
      {
        path: 'edit/contactLog/:contactLogId/contactLogType/:contactLogType',
        loadChildren: './contact-log-tab/contact-log-tab.module#ContactLogTabModule',
      },
      {
        path: 'edit/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/email/create',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/email/:emailId',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'debtorId',
        },
      },
      {
        path: 'edit/debt',
        loadChildren: './debt/debt.module#DebtModule',
      },
      {
        path: 'edit/debt/create',
        loadChildren: './debt/debt.module#DebtModule',
      },
      {
        path: 'edit/debt/debt-component/create',
        loadChildren: './debt-component/debt-component.module#DebtComponentModule',
      },
      {
        path: 'edit/debt/debt-component/:debtComponentId',
        loadChildren: './debt-component/debt-component.module#DebtComponentModule',
      },
      {
        path: 'edit/debt/promise/create',
        loadChildren: './debtor-promise/debtor-promise.module#DebtorPromiseModule',
      },
      {
        path: 'edit/debt/promise/:promiseId',
        loadChildren: './debtor-promise/debtor-promise.module#DebtorPromiseModule',
      },
      {
        path: 'edit/debt/payment/create',
        loadChildren: './debtor-payment/debtor-payment.module#DebtorPaymentModule',
      },
      {
        path: 'edit/debt/payment/:paymentId',
        loadChildren: './debtor-payment/debtor-payment.module#DebtorPaymentModule',
      },
      {
        path: 'edit/:attributeId/versions',
        loadChildren: './versions/debtor-attributes-versions.module#DebtorAttributesVersionsModule',
      },

      // Guarantee
      {
        path: 'edit/guarantee/create',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
        data: {
          edit: false,
          showContractForm: true,
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/create',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
        data: {
          edit: false,
          showContractForm: false,
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId',
        loadChildren: './guarantee/card/guarantee-card.module#GuaranteeCardModule',
        data: {
          edit: true,
          showContractForm: true,
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/guarantee/{contractId}/guarantor/{guarantorId}',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/guarantee/{contractId}/guarantor/{guarantorId}',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/guarantee/{contractId}/guarantor/{guarantorId}',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'guarantorId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/guarantee/{contractId}/guarantor/{guarantorId}',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'guarantorId',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/email/create',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'guarantorId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/guarantee/{contractId}/guarantor/{guarantorId}',
        },
      },
      {
        path: 'edit/guarantee/:contractId/guarantor/:guarantorId/email/:emailId',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'guarantorId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/guarantee/{contractId}/guarantor/{guarantorId}',
        },
      },

      // Pledge
      {
        path: 'edit/pledge/create',
        loadChildren: './pledge/card/create-contract/create-contract.module#PledgeCardCreateContractModule',
      },
      {
        path: 'edit/pledge/:contractId/pledgor/create',
        loadChildren: './pledge/card/create-pledgor/create-pledgor.module#PledgeCardCreatePledgorModule',
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/property/create',
        loadChildren: './pledge/card/create-property/create-property.module#PledgeCardCreatePropertyModule',
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/property/:propertyId',
        loadChildren: './pledge/card/edit-contract/edit-contract.module#PledgeCardEditContractModule',
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/property/:propertyId/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/property/:propertyId/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/property/:propertyId/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/property/:propertyId/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/email/create',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },
      {
        path: 'edit/pledge/:contractId/pledgor/:pledgorId/email/:emailId',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'pledgorId',
          // tslint:disable-next-line:max-line-length
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/pledge/{contractId}/pledgor/{pledgorId}/property/{propertyId}',
        },
      },

      // Contact Persons:
      {
        path: 'edit/contact/create',
        loadChildren: './contact-persons/card/contact-person-card.module#ContactPersonCardModule',
        data: {
          edit: false,
        },
      },
      {
        path: 'edit/contact/:personId',
        loadChildren: './contact-persons/card/contact-person-card.module#ContactPersonCardModule',
        data: {
          edit: true,
        },
      },
      {
        path: 'edit/contact/:personId/phone/create',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/phone/:phoneId',
        loadChildren: 'app/routes/workplaces/shared/phone/card/phone-card.module#PhoneCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/address/create',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/address/:addressId',
        loadChildren: 'app/routes/workplaces/shared/address/card/address-card.module#AddressCardModule',
        data: {
          callCenter: false,
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/employment/create',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/employment/:employmentId',
        loadChildren: 'app/routes/workplaces/shared/employment/card/employment-card.module#EmploymentCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/identity/create',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/identity/:identityId',
        loadChildren: 'app/routes/workplaces/shared/identity/card/identity-card.module#IdentityCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/document/create',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/document/:documentId',
        loadChildren: 'app/routes/workplaces/shared/documents/card/document-card.module#DocumentCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/email/create',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
      },
      {
        path: 'edit/contact/:personId/email/:emailId',
        loadChildren: 'app/routes/workplaces/shared/email/card/email-card.module#EmailCardModule',
        data: {
          entityKey: 'personId',
          parentUrl: '/app/workplaces/debtor/{debtorId}/debt/{debtId}/edit/contact/{personId}',
        },
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
