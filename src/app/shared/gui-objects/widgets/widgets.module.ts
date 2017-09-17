import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { AttributeModule } from './attribute/attribute.module';
import { ContactModule } from './contact/contact.module';
import { DebtorActionLogModule } from './action-log/action-log.module';
import { DebtModule } from './debt/debt.module';
import { DocumentModule } from './documents/document.module';
import { EmailModule } from './email/email.module';
import { EmploymentModule } from './employment/employment.module';
import { IdentityModule } from './identity/identity.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    AttributeModule,
    ContactModule,
    DebtorActionLogModule,
    DebtModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    IdentityModule,
    MessageTemplateModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ],
  exports: [
    AddressModule,
    AttributeModule,
    ContactModule,
    DebtorActionLogModule,
    DebtModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    IdentityModule,
    MessageTemplateModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
  ]
})
export class WidgetsModule { }
