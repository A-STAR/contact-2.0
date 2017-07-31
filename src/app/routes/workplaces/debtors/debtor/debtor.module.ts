import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';

import { IdentityModule } from './general-information/identity/identity.module';

import { DebtorCardEffects } from './debtor.effects';
import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorDocumentsComponent } from './documents/debtor-documents.component';
import { DebtorGeneralInformationComponent } from './general-information/debtor-general-information.component';

@NgModule({
  imports: [
    EffectsModule.run(DebtorCardEffects),
    SharedModule,
    IdentityModule,
  ],
  declarations: [
    DebtorComponent,
    DebtorDocumentsComponent,
    DebtorGeneralInformationComponent,
  ],
  providers: [
    DebtorService,
  ]
})
export class DebtorModule { }
