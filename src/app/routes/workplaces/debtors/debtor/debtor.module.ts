import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';
import { DebtorCardEffects } from './debtor.effects';
import { DebtorResolver } from './debtor.resolver';
import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorDocumentsComponent } from './documents/debtor-documents.component';
import { DebtorGeneralInformationComponent } from './general-information/debtor-general-information.component';
import { DebtorGeneralInformationPhonesComponent } from './general-information/phones/debtor-general-information-phones.component';

@NgModule({
  imports: [
    EffectsModule.run(DebtorCardEffects),
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
    DebtorDocumentsComponent,
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
