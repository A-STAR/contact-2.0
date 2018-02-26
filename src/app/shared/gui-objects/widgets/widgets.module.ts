import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeModule as EntityAttributeModule } from './entity-attribute/attribute.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';
import { DebtOpenIncomingCallModule } from './debt-open-incoming-call/debt-open-incoming-call.module';
import { EntityGroupModule } from './entity-group/entity-group.module';
import { MassOpsModule } from './mass-ops/mass-ops.module';
import { NextCallDateSetModule } from './next-call-date-set/next-call-date-set.module';
import { OperatorDetailsModule } from './operator-details/operator-details.module';
import { PaymentOperatorModule } from './payment-operator/payment-operator.module';
import { PromiseResolveModule } from './promise-resolve/promise-resolve.module';
import { VisitPrepareModule } from './visit-prepare/visit-prepare.module';

@NgModule({
  imports: [
    CommonModule,
    ContactLogModule,
    DebtResponsibleModule,
    DebtOpenIncomingCallModule,
    EntityAttributeModule,
    EntityGroupModule,
    MassOpsModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    PaymentOperatorModule,
    PromiseResolveModule,
    VisitPrepareModule,
  ],
  exports: [
    ContactLogModule,
    DebtOpenIncomingCallModule,
    DebtResponsibleModule,
    EntityAttributeModule,
    EntityGroupModule,
    MassOpsModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    PaymentOperatorModule,
    PromiseResolveModule,
    VisitPrepareModule,
  ]
})
export class WidgetsModule {}
