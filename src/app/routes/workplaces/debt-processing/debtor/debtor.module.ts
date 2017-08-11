import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAddressModule } from './address/address.module';
import { DebtorDebtComponentModule } from './debt-component/debt-component.module';
import { DebtorDebtModule } from './debt/debt.module';
import { DebtorEmailModule } from './email/email.module';
import { DebtorIdentityModule } from './identity/identity.module';
import { DebtorPhoneModule } from './phone/phone.module';

import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorDocumentsComponent } from './documents/debtor-documents.component';
import { DebtorInformationComponent } from './general/information.component';

@NgModule({
  imports: [
    DebtorAddressModule,
    DebtorDebtComponentModule,
    DebtorDebtModule,
    DebtorEmailModule,
    DebtorIdentityModule,
    DebtorPhoneModule,
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
    DebtorDocumentsComponent,
    DebtorInformationComponent,
  ],
  providers: [
    DebtorService,
  ]
})
export class DebtorModule { }
