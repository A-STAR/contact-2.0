import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';

import { DebtorsEffects } from './debtors.effects';
import { DebtorsService } from './debtors.service';

import { DebtorsComponent } from './debtors.component';
import { DebtorModule } from './debtor/debtor.module';

import { DebtorComponent } from './debtor/debtor.component';

const routes: Routes = [
  { path: '', component: DebtorsComponent },
  { path: ':id', component: DebtorComponent },
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
