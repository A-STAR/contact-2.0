import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';
import { DebtorCardEffects } from './debtor.effects';
import { DebtorResolver } from './debtor.resolver';
import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorGeneralInformationComponent } from './general-information/debtor-general-information.component';
import { DebtorGeneralInformationPhonesComponent } from './general-information/phones/debtor-general-information-phones.component';

@NgModule({
  imports: [
    EffectsModule.run(DebtorCardEffects),
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
    DebtorGeneralInformationComponent,
    DebtorGeneralInformationPhonesComponent,
  ],
  providers: [
    DebtorResolver,
    DebtorService,
  ]
})
export class DebtorModule {
}
