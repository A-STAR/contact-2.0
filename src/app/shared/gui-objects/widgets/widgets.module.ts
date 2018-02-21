import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeModule as EntityAttributeModule } from './entity-attribute/attribute.module';
import { AttributeModule } from './attribute/attribute.module';
import { ComponentLogModule } from './debt/component-log/component-log.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { ContactPropertyModule } from './contact-property/contact-property.module';
import { ContractorObjectModule } from './contractor-object/object.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';
import { DebtOpenIncomingCallModule } from './debt-open-incoming-call/debt-open-incoming-call.module';
import { DebtorActionLogModule } from './action-log/action-log.module';
import { EntityGroupModule } from './entity-group/entity-group.module';
import { MassOpsModule } from './mass-ops/mass-ops.module';
import { NextCallDateSetModule } from './next-call-date-set/next-call-date-set.module';
import { OperatorDetailsModule } from './operator-details/operator-details.module';
import { PaymentOperatorModule } from './payment-operator/payment-operator.module';
import { PersonSelectModule } from './person-select/person-select.module';
import { PortfolioLogModule } from './debt/portfolio-log/portfolio-log.module';
import { PromiseResolveModule } from './promise-resolve/promise-resolve.module';
import { VisitPrepareModule } from './visit-prepare/visit-prepare.module';

@NgModule({
  imports: [
    AttributeModule,
    CommonModule,
    ComponentLogModule,
    ContactLogModule,
    ContactPropertyModule,
    ContractorObjectModule,
    DebtResponsibleModule,
    DebtOpenIncomingCallModule,
    DebtorActionLogModule,
    EntityAttributeModule,
    EntityGroupModule,
    MassOpsModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    PaymentOperatorModule,
    PersonSelectModule,
    PortfolioLogModule,
    PromiseResolveModule,
    VisitPrepareModule,
  ],
  exports: [
    AttributeModule,
    ComponentLogModule,
    ContactLogModule,
    ContactPropertyModule,
    ContractorObjectModule,
    DebtOpenIncomingCallModule,
    DebtResponsibleModule,
    DebtorActionLogModule,
    EntityAttributeModule,
    EntityGroupModule,
    MassOpsModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    PaymentOperatorModule,
    PersonSelectModule,
    PortfolioLogModule,
    PromiseResolveModule,
    VisitPrepareModule,
  ]
})
export class WidgetsModule {}
