import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';

import { DebtorsResolver } from './debtors.resolver';
import { DebtorsEffects } from './debtors.effects';
import { DebtorsService } from './debtors.service';

import { DebtorsComponent } from './debtors.component';
import { DebtorModule } from './debtor/debtor.module';

import { DebtorResolver } from './debtor/debtor.resolver';

import { DebtorComponent } from './debtor/debtor.component';

const routes: Routes = [
  { path: '', component: DebtorsComponent, resolve: { debtor: DebtorsResolver } },
  { path: ':id', component: DebtorComponent, resolve: { debtor: DebtorResolver } },
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
    DebtorsResolver,
    DebtorsService,
  ]
})
export class DebtorsModule {
}
