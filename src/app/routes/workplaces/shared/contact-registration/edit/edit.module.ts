import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AttachmentModule } from './attachment/attachment.module';
import { AttributesModule } from './attributes/attributes.module';
import { ContactRegistrationAutoCommentModule } from './auto-comment/auto-comment.module';
import { ContactRegistrationCallReasonModule } from './call-reason/call-reason.module';
import { ContactRegistrationCommentModule } from './comment/comment.module';
import { ContactRegistrationDebtReasonModule } from './debt-reason/debt-reason.module';
import { ContactRegistrationNextCallModule } from './next-call/next-call.module';
import { ContactRegistrationPaymentModule } from './payment/payment.module';
import { ContactRegistrationPhoneModule } from './phone/phone.module';
import { ContactRegistrationPromiseModule } from './promise/promise.module';
import { ContactRegistrationRefusalModule } from './refusal/refusal.module';
import { ContactRegistrationStatusChangeModule } from './status-change/status-change.module';
import { ContactSelectModule } from './contact-select/contact-select.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { EditComponent } from './edit.component';

@NgModule({
  imports: [
    AttachmentModule,
    AttributesModule,
    ContactRegistrationAutoCommentModule,
    ContactRegistrationCallReasonModule,
    ContactRegistrationCommentModule,
    ContactRegistrationDebtReasonModule,
    ContactRegistrationNextCallModule,
    ContactRegistrationPaymentModule,
    ContactRegistrationPhoneModule,
    ContactRegistrationPromiseModule,
    ContactRegistrationRefusalModule,
    ContactRegistrationStatusChangeModule,
    ContactSelectModule,
    FormsModule,
    SelectModule,
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
