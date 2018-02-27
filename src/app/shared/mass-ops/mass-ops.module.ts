import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributesModule } from './attributes/attributes.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { DebtOpenIncomingCallModule } from './debt-open-incoming-call/debt-open-incoming-call.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';
import { DebtStatusModule } from './debt-status/debt-status.module';
import { EmailModule } from './email/email.module';
import { EntityGroupModule } from './entity-group/entity-group.module';
import { NextCallDateSetModule } from './next-call-date-set/next-call-date-set.module';
import { OpenDebtCardModule } from './debt-card-open/debt-card-open.module';
import { OperatorDetailsModule } from './operator-details/operator-details.module';
import { OutsourcingModule } from './outsourcing/outsourcing.module';
import { PaymentConfirmModule } from './payment-confirm/payment-confirm.module';
import { PaymentOperatorModule } from './payment-operator/payment-operator.module';
import { PromiseResolveModule } from './promise-resolve/promise-resolve.module';
import { SmsDeleteModule } from './sms-delete/sms-delete.module';
import { SmsModule } from './sms/sms.module';
import { VisitAddModule } from './visit-add/visit-add.module';
import { VisitPrepareModule } from './visit-prepare/visit-prepare.module';

@NgModule({
  imports: [
    AttributesModule,
    CommonModule,
    ContactLogModule,
    DebtOpenIncomingCallModule,
    DebtResponsibleModule,
    DebtStatusModule,
    EmailModule,
    EntityGroupModule,
    NextCallDateSetModule,
    OpenDebtCardModule,
    OperatorDetailsModule,
    OutsourcingModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PromiseResolveModule,
    SmsDeleteModule,
    SmsModule,
    VisitAddModule,
    VisitPrepareModule,
  ],
  exports: [
    AttributesModule,
    ContactLogModule,
    DebtOpenIncomingCallModule,
    DebtResponsibleModule,
    DebtStatusModule,
    EmailModule,
    EntityGroupModule,
    NextCallDateSetModule,
    OpenDebtCardModule,
    OperatorDetailsModule,
    OutsourcingModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PromiseResolveModule,
    SmsDeleteModule,
    SmsModule,
    VisitAddModule,
    VisitPrepareModule,
  ]
})
export class MassOpsModule {}
