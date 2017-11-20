import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridModule } from './grid/grid.module';
import { DebtorModule } from './debtor/debtor.module';
import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingService } from './debt-processing.service';

import { DebtProcessingComponent } from './debt-processing.component';
import { DebtorComponent } from './debtor/debtor.component';
import { DebtorAddressComponent } from './debtor/address/address.component';
import { DebtorContactsComponent } from './debtor/contacts/contacts.component';
import { DebtorDebtComponent } from './debtor/debt/debt.component';
import { DebtorDebtComponentComponent } from './debtor/debt-component/debt-component.component';
import { DebtorDocumentComponent } from './debtor/document/document.component';
import { DebtorEmploymentComponent } from './debtor/employment/employment.component';
import { DebtorEmailComponent } from './debtor/email/email.component';
import { DebtorGuarantorComponent } from './debtor/guarantor/guarantor.component';
import { DebtorIdentityComponent } from './debtor/identity/identity.component';
import { DebtorPaymentComponent } from './debtor/payment/payment.component';
import { DebtorPhoneComponent } from './debtor/phone/phone.component';
import { DebtorPromiseComponent } from './debtor/promise/promise.component';
import { DebtorPropertyComponent } from './debtor/property/property.component';
import { DebtorContactLogTabComponent } from './debtor/contact-log-tab/contact-log-tab.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
  { path: ':personId/:debtId', children: [
      { path: '', pathMatch: 'full', component: DebtorComponent },
      { path: 'guaranteeContract', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorGuarantorComponent },
          { path: 'edit', component: DebtorGuarantorComponent },
          { path: 'addGuarantor', component: DebtorGuarantorComponent },
        ]
      },
      { path: 'property', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorPropertyComponent },
          { path: ':propertyId', component: DebtorPropertyComponent },
        ]
      },
      { path: 'contactLog', children: [
          { path: 'create', component: DebtorContactLogTabComponent },
          { path: ':contactLogId/contactLogType/:contactLogType', component: DebtorContactLogTabComponent },
        ]
      },
      { path: 'contact', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorContactsComponent },
          { path: ':contactId', children: [
              { path: '', component: DebtorContactsComponent },
              { path: 'phone', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorPhoneComponent },
                  { path: ':phoneId', component: DebtorPhoneComponent },
                ]
              },
              { path: 'address', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorAddressComponent },
                  { path: ':addressId', component: DebtorAddressComponent },
                ]
              },
              { path: 'identity', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorIdentityComponent },
                  { path: ':identityId', component: DebtorIdentityComponent },
                ]
              },
              { path: 'employment', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorEmploymentComponent },
                  { path: ':employmentId', component: DebtorEmploymentComponent },
                ]
              },
            ]
          },
        ]
      },
      { path: 'document', children: [
        { path: '', redirectTo: 'create', pathMatch: 'full' },
        { path: 'create', component: DebtorDocumentComponent },
        { path: ':documentId', component: DebtorDocumentComponent },
        ]
      },
      { path: 'address', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorAddressComponent },
          { path: ':addressId', component: DebtorAddressComponent },
        ]
      },
      { path: 'email', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorEmailComponent },
          { path: ':emailId', component: DebtorEmailComponent },
        ]
      },
      { path: 'employment', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorEmploymentComponent },
          { path: ':employmentId', component: DebtorEmploymentComponent },
        ]
      },
      { path: 'identity', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorIdentityComponent },
          { path: ':identityId', component: DebtorIdentityComponent },
        ]
      },
      { path: 'phone', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorPhoneComponent },
          { path: ':phoneId', component: DebtorPhoneComponent },
        ]
      },
      { path: 'debt', children: [
          { path: '', component: DebtorDebtComponent },
          { path: 'create', component: DebtorDebtComponent },
          { path: 'debt-component', children: [
              { path: '', redirectTo: '', pathMatch: 'full' },
              { path: 'create', component: DebtorDebtComponentComponent },
              { path: ':debtComponentId', component: DebtorDebtComponentComponent },
            ]
          },
          { path: 'promise', children: [
              { path: '', redirectTo: '', pathMatch: 'full' },
              { path: 'create', component: DebtorPromiseComponent },
              { path: ':promiseId', component: DebtorPromiseComponent },
            ]
          },
          { path: 'payment', children: [
              { path: '', redirectTo: '', pathMatch: 'full' },
              { path: 'create', component: DebtorPaymentComponent },
              { path: ':paymentId', component: DebtorPaymentComponent },
            ]
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [
    GridModule,
    DebtorModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtProcessingComponent,
  ],
  providers: [
    DebtProcessingService,
    { provide: 'entityTypeId', useValue: 19 },
    { provide: 'manualGroup', useValue: true }
  ]
})
export class DebtProcessingModule {
}
