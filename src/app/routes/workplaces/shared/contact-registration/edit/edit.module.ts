import { NgModule } from '@angular/core';

import { AttachmentModule } from './attachment/attachment.module';
import { AttributesModule } from './attributes/attributes.module';
import { ContactModule } from './contact/contact.module';
import { ContactSelectModule } from './contact-select/contact-select.module';
import { MiscModule } from './misc/misc.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';
import { SharedModule } from '@app/shared/shared.module';

import { EditComponent } from './edit.component';

@NgModule({
  imports: [
    AttachmentModule,
    AttributesModule,
    ContactModule,
    ContactSelectModule,
    MiscModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
    SharedModule,
  ],
  exports: [
    EditComponent,
  ],
  declarations: [
    EditComponent,
  ],
})
export class EditModule {}
