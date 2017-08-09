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
import { DebtorEmailComponent } from './debtor/email/email.component';
import { DebtorPhoneComponent } from './debtor/phone/phone.component';

const routes: Routes = [
  { path: '', component: DebtProcessingComponent },
  { path: ':id', component: DebtorComponent },
  { path: ':id/address/create', component: DebtorAddressComponent },
  { path: ':id/address/:addressId', component: DebtorAddressComponent },
  { path: ':id/email/create', component: DebtorEmailComponent },
  { path: ':id/email/:emailId', component: DebtorEmailComponent },
  { path: ':id/phone/create', component: DebtorPhoneComponent },
  { path: ':id/phone/:phoneId', component: DebtorPhoneComponent },
  { path: ':id/debt/:debtId', component: DebtorDebtComponent },
  { path: ':id/debt/:debtId', component: DebtorDebtComponent }
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
