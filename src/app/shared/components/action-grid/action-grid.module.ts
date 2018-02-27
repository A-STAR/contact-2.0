import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionGridFilterModule } from './filter/action-grid-filter.module';
import { ContactLogModule } from '@app/shared/mass-ops/contact-log/contact-log.module';
import { DebtOpenIncomingCallModule } from '@app/shared/mass-ops/debt-open-incoming-call/debt-open-incoming-call.module';
import { DebtStatusModule } from '@app/shared/mass-ops/debt-status/debt-status.module';
import { DebtResponsibleModule } from '@app/shared/mass-ops/debt-responsible/debt-responsible.module';
import { EntityGroupModule } from '@app/shared/mass-ops/entity-group/entity-group.module';
import { GridModule } from '../grid/grid.module';
import { MassOpsModule } from '@app/shared/mass-ops/mass-ops.module';
import { Grid2Module } from '../grid2/grid2.module';
import { NextCallDateSetModule } from '@app/shared/mass-ops/next-call-date-set/next-call-date-set.module';
import { OpenDebtCardModule } from '@app/shared/mass-ops/debt-card-open/debt-card-open.module';
import { OperatorDetailsModule } from '@app/shared/mass-ops/operator-details/operator-details.module';
import { PaymentConfirmModule } from '@app/shared/mass-ops/payment-confirm/payment-confirm.module';
import { PromiseResolveModule } from '@app/shared/mass-ops/promise-resolve/promise-resolve.module';
import { PaymentOperatorModule } from '@app/shared/mass-ops/payment-operator/payment-operator.module';
import { SmsDeleteModule } from '@app/shared/mass-ops/sms-delete/sms-delete.module';
import { TitlebarModule } from '../titlebar/titlebar.module';
import { VisitAddModule } from '@app/shared/mass-ops/visit-add/visit-add.module';
import { VisitPrepareModule } from '@app/shared/mass-ops/visit-prepare/visit-prepare.module';

import { ActionGridComponent } from './action-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ContactLogModule,
    DebtOpenIncomingCallModule,
    DebtStatusModule,
    DebtResponsibleModule,
    EntityGroupModule,
    GridModule,
    Grid2Module,
    MassOpsModule,
    ActionGridFilterModule,
    NextCallDateSetModule,
    OpenDebtCardModule,
    OperatorDetailsModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PromiseResolveModule,
    SmsDeleteModule,
    TitlebarModule,
    VisitAddModule,
    VisitPrepareModule,
  ],
  exports: [
    ActionGridComponent,
  ],
  declarations: [
    ActionGridComponent,
  ]
})
export class ActionGridModule { }
