import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';
import { DebtorCardEffects } from './debtor.effects';
import { DebtorResolver } from './debtor.resolver';
import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorDocumentsComponent } from './documents/debtor-documents.component';
import { DebtorGeneralInformationComponent } from './general-information/debtor-general-information.component';
import { PhoneGridComponent } from './general-information/phones/phone.component';
import { IdentityGridComponent } from './general-information/identity/identity.component';

@NgModule({
  imports: [
    EffectsModule.run(DebtorCardEffects),
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
    DebtorDocumentsComponent,
    DebtorGeneralInformationComponent,
    PhoneGridComponent,
    IdentityGridComponent,
  ],
  providers: [
    DebtorResolver,
    DebtorService,
  ]
})
export class DebtorModule { }
