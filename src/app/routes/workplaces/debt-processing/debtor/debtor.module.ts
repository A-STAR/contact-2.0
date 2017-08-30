import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAddressModule } from './address/address.module';
import { DebtorContactsModule } from './contacts/contacts.module';
import { DebtorDebtComponentModule } from './debt-component/debt-component.module';
import { DebtorDebtModule } from './debt/debt.module';
import { DebtorEmailModule } from './email/email.module';
import { DebtorEmploymentModule } from './employment/employment.module';
import { DebtorIdentityModule } from './identity/identity.module';
import { DebtorPaymentModule } from './payment/payment.module';
import { DebtorPhoneModule } from './phone/phone.module';
import { DebtorPromiseModule } from './promise/promise.module';

import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorDocumentsComponent } from './documents/debtor-documents.component';
import { DebtorInformationComponent } from './general/information.component';

@NgModule({
  imports: [
    DebtorAddressModule,
    DebtorContactsModule,
    DebtorDebtComponentModule,
    DebtorDebtModule,
    DebtorEmailModule,
    DebtorEmploymentModule,
    DebtorIdentityModule,
    DebtorPaymentModule,
    DebtorPhoneModule,
    DebtorPromiseModule,
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
