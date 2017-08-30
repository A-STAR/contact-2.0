import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { DebtorModule } from './debtor/debtor.module';
import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingEffects } from './debt-processing.effects';
import { DebtProcessingService } from './debt-processing.service';

import { DebtProcessingComponent } from './debt-processing.component';

import { DebtorComponent } from './debtor/debtor.component';
import { DebtorAddressComponent } from './debtor/address/address.component';
import { DebtorContactsComponent } from './debtor/contacts/contacts.component';
import { DebtorDebtComponent } from './debtor/debt/debt.component';
import { DebtorDebtComponentComponent } from './debtor/debt-component/debt-component.component';
import { DebtorEmploymentComponent } from './debtor/employment/employment.component';
import { DebtorEmailComponent } from './debtor/email/email.component';
import { DebtorIdentityComponent } from './debtor/identity/identity.component';
import { DebtorPaymentComponent } from './debtor/payment/payment.component';
import { DebtorPhoneComponent } from './debtor/phone/phone.component';
import { DebtorPromiseComponent } from './debtor/promise/promise.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
  { path: ':id', component: DebtorComponent },
  { path: ':id/address', children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorAddressComponent },
      { path: ':addressId', component: DebtorAddressComponent },
    ]
  },
  { path: ':id/contact', children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorContactsComponent },
      { path: ':contactId', component: DebtorContactsComponent },
      { path: ':contactId/phone', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorPhoneComponent },
          { path: ':phoneId', component: DebtorPhoneComponent },
        ]
      },
      { path: ':contactId/address', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorAddressComponent },
          { path: ':addressId', component: DebtorAddressComponent },
        ]
      },
      { path: ':contactId/identity', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorIdentityComponent },
          { path: ':identityId', component: DebtorIdentityComponent },
        ]
      },
      { path: ':contactId/employment', children: [
          { path: '', redirectTo: 'create', pathMatch: 'full' },
          { path: 'create', component: DebtorEmploymentComponent },
          { path: ':employmentId', component: DebtorEmploymentComponent },
        ]
      },
    ]
  },
  { path: ':id/email', children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorEmailComponent },
      { path: ':emailId', component: DebtorEmailComponent },
    ]
  },
  { path: ':id/employment', children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorEmploymentComponent },
      { path: ':employmentId', component: DebtorEmploymentComponent },
    ]
  },
  { path: ':id/identity', children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorIdentityComponent },
      { path: ':identityId', component: DebtorIdentityComponent },
    ]
  },
  { path: ':id/phone', children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DebtorPhoneComponent },
      { path: ':phoneId', component: DebtorPhoneComponent },
    ]
  },
  { path: ':id/debt', children: [
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
];

@NgModule({
  imports: [
    DebtorModule,
    EffectsModule.run(DebtProcessingEffects),
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
