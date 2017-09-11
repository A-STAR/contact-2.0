import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { DebtorIdentityComponent } from './debtor/identity/identity.component';
import { DebtorPaymentComponent } from './debtor/payment/payment.component';
import { DebtorPhoneComponent } from './debtor/phone/phone.component';
import { DebtorPromiseComponent } from './debtor/promise/promise.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
  { path: ':id', children: [
      { path: '', pathMatch: 'full', component: DebtorComponent },
      { path: 'address', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorAddressComponent },
          { path: ':addressId', component: DebtorAddressComponent },
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
          { path: '', redirectTo: '..', pathMatch: 'full' },
          { path: 'create', component: DebtorDebtComponent },
          { path: ':debtId', children: [
              { path: '', pathMatch: 'full', component: DebtorDebtComponent },
              { path: 'debt-component', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorDebtComponentComponent },
                  { path: ':debtComponentId', component: DebtorDebtComponentComponent },
                ]
              },
              { path: 'promise', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorPromiseComponent },
                  { path: ':promiseId', component: DebtorPromiseComponent },
                ]
              },
              { path: 'payment', children: [
                  { path: '', redirectTo: 'create', pathMatch: 'full' },
                  { path: 'create', component: DebtorPaymentComponent },
                  { path: ':paymentId', component: DebtorPaymentComponent },
                ]
              }
            ]
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [
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
    DebtProcessingService
  ]
})
export class DebtProcessingModule {
}
