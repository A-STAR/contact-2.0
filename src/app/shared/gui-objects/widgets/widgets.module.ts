import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { AttributeModule as EntityAttributeModule } from './entity-attribute/attribute.module';
import { AttributeModule } from './attribute/attribute.module';
import { ComponentLogModule } from './debt/component-log/component-log.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { ContactLogTabModule } from './contact-log-tab/contact-log.module';
import { ContactModule } from './contact/contact.module';
import { ContactPropertyModule } from './contact-property/contact-property.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { CurrencyRatesModule } from './currency-rates/currency-rates.module';
import { DebtComponentModule } from './debt/component/debt-component.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';
import { DebtorActionLogModule } from './action-log/action-log.module';
import { DocumentModule } from './documents/document.module';
import { EmailModule } from './email/email.module';
import { EmploymentModule } from './employment/employment.module';
import { EntityGroupModule } from './entity-group/entity-group.module';
import { GuaranteeModule } from './guarantee/guarantee.module';
import { GuarantorModule } from './guarantor/guarantor.module';
import { IdentityModule } from './identity/identity.module';
import { MassOpsModule } from './mass-ops/mass-ops.module';
import { NextCallDateSetModule } from './next-call-date-set/next-call-date-set.module';
import { ObjectModule } from './object/object.module';
import { OperatorDetailsModule } from './operator-details/operator-details.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentOperatorModule } from './payment-operator/payment-operator.module';
import { PersonSelectModule } from './person-select/person-select.module';
import { PhoneModule } from './phone/phone.module';
import { PledgeModule } from './pledge/pledge.module';
import { PledgorModule } from './pledgor/pledgor.module';
import { PledgorPropertyModule } from './pledgor-property/pledgor-property.module';
import { PortfolioLogModule } from './debt/portfolio-log/portfolio-log.module';
import { PromiseModule } from './promise/promise.module';
import { PromiseResolveModule } from './promise-resolve/promise-resolve.module';
import { PropertyModule } from './property/property.module';
import { GroupModule } from './groups/group.module';
import { VisitPrepareModule } from './visit-prepare/visit-prepare.module';

@NgModule({
  imports: [
    AddressModule,
    AttributeModule,
    CommonModule,
    ComponentLogModule,
    ContactLogModule,
    ContactLogTabModule,
    ContactModule,
    ContactPropertyModule,
    CurrenciesModule,
    CurrencyRatesModule,
    DebtComponentModule,
    DebtResponsibleModule,
    DebtorActionLogModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    EntityAttributeModule,
    EntityGroupModule,
    GuaranteeModule,
    GuarantorModule,
    IdentityModule,
    MassOpsModule,
    NextCallDateSetModule,
    ObjectModule,
    OperatorDetailsModule,
    PaymentModule,
    PaymentOperatorModule,
    PersonSelectModule,
    PhoneModule,
    PledgeModule,
    PledgorModule,
    PledgorPropertyModule,
    PortfolioLogModule,
    PromiseModule,
    PromiseResolveModule,
    PropertyModule,
    GroupModule,
    VisitPrepareModule,
  ],
  exports: [
    AddressModule,
    AttributeModule,
    ComponentLogModule,
    ContactLogModule,
    ContactLogTabModule,
    ContactModule,
    ContactPropertyModule,
    CurrenciesModule,
    CurrencyRatesModule,
    DebtComponentModule,
    DebtResponsibleModule,
    DebtorActionLogModule,
    DocumentModule,
    EmailModule,
    EmploymentModule,
    EntityAttributeModule,
    EntityGroupModule,
    GuaranteeModule,
    GuarantorModule,
    IdentityModule,
    MassOpsModule,
    NextCallDateSetModule,
    ObjectModule,
    OperatorDetailsModule,
    PaymentModule,
    PaymentOperatorModule,
    PersonSelectModule,
    PhoneModule,
    PledgeModule,
    PledgorModule,
    PledgorPropertyModule,
    PortfolioLogModule,
    PromiseModule,
    PromiseResolveModule,
    PropertyModule,
    GroupModule,
    VisitPrepareModule,
  ]
})
export class WidgetsModule { }
