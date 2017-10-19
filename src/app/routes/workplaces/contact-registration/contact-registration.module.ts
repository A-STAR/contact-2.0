import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttachmentModule } from './attachment/attachment.module';
import { AttributesModule } from './attributes/attributes.module';
import { CommentModule } from './comment/comment.module';
import { MiscModule } from './misc/misc.module';
import { OutcomeModule } from './outcome/outcome.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactRegistrationComponent } from './contact-registration.component';

const routes: Routes = [
  { path: ':debtId/:contactTypeCode/:contactId', component: ContactRegistrationComponent },
];

@NgModule({
  imports: [
    AttachmentModule,
    AttributesModule,
    CommentModule,
    MiscModule,
    OutcomeModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ContactRegistrationComponent,
  ]
})
export class ContactRegistrationModule {}
