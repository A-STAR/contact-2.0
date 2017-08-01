import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';

import { DebtorsEffects } from './debtors.effects';
import { DebtorsService } from './debtors.service';

import { DebtorsComponent } from './debtors.component';
import { DebtorModule } from './debtor/debtor.module';

import { DebtorComponent } from './debtor/debtor.component';
import { DebtorAddressComponent } from './debtor/address/address.component';

const routes: Routes = [
  { path: '', component: DebtorsComponent },
  { path: ':id', component: DebtorComponent },
  { path: ':id/address/:addressId', component: DebtorAddressComponent }
];

@NgModule({
  imports: [
    EffectsModule.run(DebtorsEffects),
    RouterModule.forChild(routes),
    SharedModule,
    DebtorModule,
  ],
  declarations: [
    DebtorsComponent,
  ],
  providers: [
    DebtorsService,
  ]
})
export class DebtorsModule {}
