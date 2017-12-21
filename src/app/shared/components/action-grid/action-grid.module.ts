import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactLogModule } from '../../gui-objects/widgets/contact-log/contact-log.module';
import { DebtResponsibleModule } from '../../gui-objects/widgets/debt-responsible/debt-responsible.module';
import { EntityGroupModule } from '../../gui-objects/widgets/entity-group/entity-group.module';
import { GridModule } from '../grid/grid.module';
import { MassOpsModule } from '../../gui-objects/widgets/mass-ops/mass-ops.module';
import { MetadataGridModule } from '../metadata-grid/metadata-grid.module';
import { PaymentConfirmModule } from '../../gui-objects/widgets/payment-confirm/payment-confirm.module';
import { PromiseResolveModule } from '../../gui-objects/widgets/promise-resolve/promise-resolve.module';
import { PaymentOperatorModule } from '../../gui-objects/widgets/payment-operator/payment-operator.module';
import { VisitAddModule } from '../../gui-objects/widgets/visit-add/visit-add.module';
import { SmsDeleteModule } from '../../gui-objects/widgets/sms-delete/sms-delete.module';
import { OpenDebtCardModule } from '../../gui-objects/widgets/debt-card-open/debt-card-open.module';

import { ActionGridComponent } from './action-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ContactLogModule,
    DebtResponsibleModule,
    EntityGroupModule,
    GridModule,
    MassOpsModule,
    MetadataGridModule,
    OpenDebtCardModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PromiseResolveModule,
    SmsDeleteModule,
    VisitAddModule,
  ],
  exports: [
    ActionGridComponent,
  ],
  declarations: [
    ActionGridComponent,
  ]
})
export class ActionGridModule { }
