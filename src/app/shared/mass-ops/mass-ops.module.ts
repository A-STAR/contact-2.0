import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressModule } from './address/address.module';
import { AttributesModule } from './attributes/attributes.module';
import { ConfirmModule } from '@app/shared/mass-ops/confirm/confirm.module';
import { ContactLogModule } from './contact-log/contact-log.module';
import { CustomOperationModule } from './custom-operation/custom-operation.module';
import { DebtResponsibleModule } from './debt-responsible/debt-responsible.module';
import { DebtStatusModule } from './debt-status/debt-status.module';
import { EmailModule } from './email/email.module';
import { EntityGroupModule } from './entity-group/entity-group.module';
import { NextCallDateSetModule } from './next-call-date-set/next-call-date-set.module';
import { OperatorDetailsModule } from './operator-details/operator-details.module';
import { OutsourcingModule } from './outsourcing/outsourcing.module';
import { PaymentConfirmModule } from './payment-confirm/payment-confirm.module';
import { PaymentOperatorModule } from './payment-operator/payment-operator.module';
import { PersonTypeModule } from '@app/shared/mass-ops/person-type/person-type.module';
import { PromiseResolveModule } from './promise-resolve/promise-resolve.module';
import { RegisterContactOpenModule } from './register-contact-open/register-contact-open.module';
import { SmsDeleteModule } from './sms-delete/sms-delete.module';
import { SmsModule } from './sms/sms.module';
import { VisitAddModule } from './visit-add/visit-add.module';
import { VisitPrepareModule } from './visit-prepare/visit-prepare.module';

import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';

import { MassOperationComponent } from './mass-operation.component';

@NgModule({
  imports: [
    AddressModule,
    AttributesModule,
    CommonModule,
    ConfirmModule,
    ContactLogModule,
    CustomOperationModule,
    DebtResponsibleModule,
    DebtStatusModule,
    EmailModule,
    EntityGroupModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    OutsourcingModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PersonTypeModule,
    PromiseResolveModule,
    RegisterContactOpenModule,
    SmsDeleteModule,
    SmsModule,
    VisitAddModule,
    VisitPrepareModule,
  ],
  exports: [
    AddressModule,
    AttributesModule,
    ContactLogModule,
    CustomOperationModule,
    DebtResponsibleModule,
    DebtStatusModule,
    EmailModule,
    EntityGroupModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    OutsourcingModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PersonTypeModule,
    PromiseResolveModule,
    RegisterContactOpenModule,
    SmsDeleteModule,
    SmsModule,
    VisitAddModule,
    VisitPrepareModule,
    MassOperationComponent
  ],
  declarations: [
    MassOperationComponent
  ],
  providers: [ MassOperationsService ]
})
export class MassOpsModule {}
