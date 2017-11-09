import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { AttributeModule } from './attribute/attribute.module';
import { AttributeModule as EntityAttributeModule } from './entity-attribute/attribute.module';
import { ContactModule } from './contact/contact.module';
import { ContactPropertyModule } from './contact-property/contact-property.module';
import { DebtorActionLogModule } from './action-log/action-log.module';
import { DebtModule } from './debt/debt.module';
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
import { OperatorModule } from './operator/operator.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';

@NgModule({
  imports: [
    CommonModule,
    AddressModule,
    AttributeModule,
    ContactModule,
    ContactPropertyModule,
    DebtorActionLogModule,
    DebtModule,
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
    OperatorModule,
    DebtResponsibleModule,
  ],
  exports: [
    AddressModule,
    AttributeModule,
    ContactModule,
    ContactPropertyModule,
    DebtorActionLogModule,
    DebtModule,
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
    OperatorModule,
    DebtResponsibleModule,
  ]
})
export class WidgetsModule { }
