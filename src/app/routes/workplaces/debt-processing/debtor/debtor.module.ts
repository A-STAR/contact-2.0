import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorActionLogModule } from './action-log/action-log.module';
import { DebtorAddressModule } from './address/address.module';
import { DebtorContactsModule } from './contacts/contacts.module';
import { DebtorDebtComponentModule } from './debt-component/debt-component.module';
import { DebtorDebtModule } from './debt/debt.module';
import { DebtorDocumentModule } from './document/document.module';
import { DebtorEmailModule } from './email/email.module';
import { DebtorEmploymentModule } from './employment/employment.module';
import { DebtorIdentityModule } from './identity/identity.module';
import { DebtorPaymentModule } from './payment/payment.module';
import { DebtorPhoneModule } from './phone/phone.module';
import { DebtorPromiseModule } from './promise/promise.module';

import { DebtorService } from './debtor.service';

import { DebtorComponent } from './debtor.component';
import { DebtorInformationComponent } from './general/information.component';

@NgModule({
  imports: [
    DebtorActionLogModule,
    DebtorAddressModule,
    DebtorContactsModule,
    DebtorDebtComponentModule,
    DebtorDebtModule,
    DebtorDocumentModule,
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
    DebtorInformationComponent,
  ],
  providers: [
    DebtorService,
  ]
})
export class DebtorModule { }
