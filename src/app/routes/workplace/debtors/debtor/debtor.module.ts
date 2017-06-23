import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';
import { DebtorCardEffects } from './debtor.effects';

import { DebtorComponent } from './debtor.component';
import { DebtorResolver } from './debtor.resolver';
import { DebtorService } from './debtor.service';

const routes: Routes = [
  { path: '', component: DebtorComponent, resolve: { debtor: DebtorResolver } },
];

@NgModule({
  imports: [
    EffectsModule.run(DebtorCardEffects),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
  ],
  providers: [
    DebtorResolver,
    DebtorService,
  ]
})
export class DebtorModule {
}
