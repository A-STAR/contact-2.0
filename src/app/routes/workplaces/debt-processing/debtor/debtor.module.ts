import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAddressModule } from './address/address.module';
import { DebtorContactsModule } from './contacts/contacts.module';
import { DebtorDebtComponentModule } from './debt-component/debt-component.module';
import { DebtorDebtModule } from './debt/debt.module';
import { DebtorDocumentModule } from './document/document.module';
import { DebtorEmailModule } from './email/email.module';
import { DebtorEmploymentModule } from './employment/employment.module';
import { DebtorGuarantorModule } from './guarantor/guarantor.module';
import { DebtorIdentityModule } from './identity/identity.module';
import { DebtorPaymentModule } from './payment/payment.module';
import { DebtorPhoneModule } from './phone/phone.module';
import { DebtorPromiseModule } from './promise/promise.module';
import { DebtorPropertyModule } from './property/property.module';
import { DebtsModule } from './debts/debts.module';
import { RegisterContactModule } from './register-contact/register-contact.module';
import { DebtorPropertyAttributesModule } from './property-attributes/property-attributes.module';
import { DebtorPledgeAttributesModule } from './pledge-attributes/pledge-attributes.module';
import { DebtorAttributesModule } from './attributes/attributes.module';
import { DebtorPledgeModule } from './pledge/pledge.module';
import { InformationModule } from './information/information.module';

import { DebtorComponent } from './debtor.component';
import { ContactLogTabModule } from './contact-log-tab/contact-log-tab.module';

@NgModule({
  imports: [
    ContactLogModule,
    DebtorAddressModule,
    DebtorContactsModule,
    DebtorDebtComponentModule,
    DebtorDebtModule,
    DebtorDocumentModule,
    DebtorEmailModule,
    DebtorEmploymentModule,
    DebtorGuarantorModule,
    DebtorIdentityModule,
    DebtorPaymentModule,
    DebtorPhoneModule,
    DebtorPromiseModule,
    DebtorPropertyModule,
    ContactLogTabModule,
    DebtorPropertyAttributesModule,
    DebtorPledgeAttributesModule,
    DebtorAttributesModule,
    DebtsModule,
    InformationModule,
    RegisterContactModule,
    DebtorPledgeModule,
    SharedModule,
  ],
  declarations: [
    DebtorComponent,
  ]
})
export class DebtorModule { }
