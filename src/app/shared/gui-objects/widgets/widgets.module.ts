import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { AttributeModule } from './attribute/attribute.module';
import { AttributeModule as EntityAttributeModule } from './entity-attribute/attribute.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { ContactLogTabModule } from './contact-log-tab/contact-log.module';
import { ContactModule } from './contact/contact.module';
import { ContactPropertyModule } from './contact-property/contact-property.module';
import { DebtorActionLogModule } from './action-log/action-log.module';
import { DebtModule } from './debt/debt.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';
import { DocumentModule } from './documents/document.module';
import { EmailModule } from './email/email.module';
import { EmploymentModule } from './employment/employment.module';
import { GuaranteeModule } from './guarantee/guarantee.module';
import { GuarantorModule } from './guarantor/guarantor.module';
import { IdentityModule } from './identity/identity.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { ObjectModule } from './object/object.module';
import { PaymentModule } from './payment/payment.module';
import { PhoneModule } from './phone/phone.module';
import { PromiseModule } from './promise/promise.module';
import { PropertyModule } from './property/property.module';
import { EntityGroupModule } from './entity-group/entity-group.module';
import { PledgorModule } from './pledgor/pledgor.module';
import { PledgorPropertyModule } from './pledgor-property/pledgor-property.module';
import { PledgeModule } from './pledge/pledge.module';
import { PromiseResolveModule } from './promise-resolve/promise-resolve.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    AttributeModule,
    ContactLogModule,
    ContactLogTabModule,
    ContactModule,
    ContactPropertyModule,
    DebtorActionLogModule,
    DebtModule,
    DebtResponsibleModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    EntityAttributeModule,
    GuaranteeModule,
    GuarantorModule,
    IdentityModule,
    MessageTemplateModule,
    ObjectModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
    PropertyModule,
    EntityGroupModule,
    PledgorModule,
    PledgorPropertyModule,
    PledgeModule,
    PromiseResolveModule,
  ],
  exports: [
    AddressModule,
    AttributeModule,
    ContactLogModule,
    ContactLogTabModule,
    ContactModule,
    ContactPropertyModule,
    DebtorActionLogModule,
    DebtModule,
    DebtResponsibleModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    EntityAttributeModule,
    GuaranteeModule,
    GuarantorModule,
    IdentityModule,
    MessageTemplateModule,
    ObjectModule,
    PaymentModule,
    PhoneModule,
    PromiseModule,
    PropertyModule,
    EntityGroupModule,
    PledgeModule,
    PledgorModule,
    PledgorPropertyModule,
    PromiseResolveModule,
  ]
})
export class WidgetsModule { }
