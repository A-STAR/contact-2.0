import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttachmentModule } from './attachment/attachment.module';
import { AttributesModule } from './attributes/attributes.module';
import { ContactModule } from './contact/contact.module';
import { ContactSelectModule } from './contact-select/contact-select.module';
import { MiscModule } from './misc/misc.module';
import { OutcomeModule } from './outcome/outcome.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContactRegistrationComponent } from './contact-registration.component';

const routes: Routes = [
  {
    path: '',
    component: ContactRegistrationComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    AttachmentModule,
    AttributesModule,
    ContactModule,
    ContactSelectModule,
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
