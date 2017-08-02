import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

// import { IdentityModule } from '../../../../shared/gui-objects/widgets/identity/identity.module';
import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAddressModule } from './address/address.module';
import { DebtorEmailModule } from './email/email.module';
import { DebtorPhoneModule } from './phone/phone.module';

import { DebtorCardEffects } from './debtor.effects';
import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorDocumentsComponent } from './documents/debtor-documents.component';
import { DebtorGeneralInformationComponent } from './general-information/debtor-general-information.component';

@NgModule({
  imports: [
    DebtorAddressModule,
    DebtorEmailModule,
    DebtorPhoneModule,
    EffectsModule.run(DebtorCardEffects),
    SharedModule,
    // IdentityModule,
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
