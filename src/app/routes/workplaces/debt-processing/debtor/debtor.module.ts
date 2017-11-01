import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
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

import { ContactLogModule } from './contact-log/contact-log.module';

import { DebtorPropertyAttributesModule } from './property-attributes/property-attributes.module';
import { DebtorAttributesModule } from './attributes/attributes.module';


import { DebtorService } from './debtor.service';
import { DebtorEffects } from './debtor.effects';

import { DebtorComponent } from './debtor.component';
import { DebtorInformationComponent } from './general/information.component';

@NgModule({
  imports: [
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
<<<<<<< HEAD
    ContactLogModule,
=======
    DebtorPropertyAttributesModule,
    DebtorAttributesModule,
>>>>>>> 88ce9097400f20ed0985b183251379b12277764d
    EffectsModule.run(DebtorEffects),
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
