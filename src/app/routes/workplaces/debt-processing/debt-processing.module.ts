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
import { DebtorDebtComponent } from './debtor/debt/debt.component';
import { DebtorDebtComponentComponent } from './debtor/debt-component/debt-component.component';
import { DebtorEmploymentComponent } from './debtor/employment/employment.component';
import { DebtorEmailComponent } from './debtor/email/email.component';
import { DebtorIdentityComponent } from './debtor/identity/identity.component';
import { DebtorPhoneComponent } from './debtor/phone/phone.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
  { path: ':id', component: DebtorComponent },
  { path: ':id/address/create', component: DebtorAddressComponent },
  { path: ':id/address/:addressId', component: DebtorAddressComponent },
  { path: ':id/email/create', component: DebtorEmailComponent },
  { path: ':id/email/:emailId', component: DebtorEmailComponent },
  { path: ':id/employment/create', component: DebtorEmploymentComponent },
  { path: ':id/employment/:employmentId', component: DebtorEmploymentComponent },
  { path: ':id/phone/create', component: DebtorPhoneComponent },
  { path: ':id/identity/create', component: DebtorIdentityComponent },
  { path: ':id/identity/:identityId', component: DebtorIdentityComponent },
  { path: ':id/phone/:phoneId', component: DebtorPhoneComponent },
  { path: ':id/debt/:debtId', component: DebtorDebtComponent },
  { path: ':id/debt/:debtId', component: DebtorDebtComponent },
  { path: ':id/debt/:debtId/debt-component/create', component: DebtorDebtComponentComponent },
  { path: ':id/debt/:debtId/debt-component/:debtComponentId', component: DebtorDebtComponentComponent },
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
