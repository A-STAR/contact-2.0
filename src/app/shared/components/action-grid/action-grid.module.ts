import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionGridFilterModule } from './filter/action-grid-filter.module';
import { AreaModule } from '@app/shared/components/layout/area/area.module';
import { ContactLogModule } from '@app/shared/mass-ops/contact-log/contact-log.module';
import { DebtResponsibleModule } from '@app/shared/mass-ops/debt-responsible/debt-responsible.module';
import { DebtStatusModule } from '@app/shared/mass-ops/debt-status/debt-status.module';
import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';
import { DownloaderModule } from '@app/shared/components/downloader/downloader.module';
import { EntityGroupModule } from '@app/shared/mass-ops/entity-group/entity-group.module';
import { ExcelFilterModule } from './excel-filter/excel-filter.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';
import { Grid2Module } from '../grid2/grid2.module';
import { MassOpsModule } from '@app/shared/mass-ops/mass-ops.module';
import { NextCallDateSetModule } from '@app/shared/mass-ops/next-call-date-set/next-call-date-set.module';
import { OperatorDetailsModule } from '@app/shared/mass-ops/operator-details/operator-details.module';
import { PaymentConfirmModule } from '@app/shared/mass-ops/payment-confirm/payment-confirm.module';
import { PaymentOperatorModule } from '@app/shared/mass-ops/payment-operator/payment-operator.module';
import { PersonTypeModule } from '@app/shared/mass-ops/person-type/person-type.module';
import { PromiseResolveModule } from '@app/shared/mass-ops/promise-resolve/promise-resolve.module';
import { RegisterContactOpenModule } from '@app/shared/mass-ops/register-contact-open/register-contact-open.module';
import { SmsDeleteModule } from '@app/shared/mass-ops/sms-delete/sms-delete.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { VisitAddModule } from '@app/shared/mass-ops/visit-add/visit-add.module';
import { VisitPrepareModule } from '@app/shared/mass-ops/visit-prepare/visit-prepare.module';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';

import { ActionGridComponent } from './action-grid.component';

@NgModule({
  imports: [
    AreaModule,
    CommonModule,
    ContactLogModule,
    DebtStatusModule,
    DebtResponsibleModule,
    DownloaderModule,
    DynamicLayoutModule,
    EntityGroupModule,
    ExcelFilterModule,
    GridsModule,
    Grid2Module,
    MassOpsModule,
    ActionGridFilterModule,
    NextCallDateSetModule,
    OperatorDetailsModule,
    PaymentConfirmModule,
    PaymentOperatorModule,
    PersonTypeModule,
    PromiseResolveModule,
    SmsDeleteModule,
    ToolbarModule,
    VisitAddModule,
    VisitPrepareModule,
    RegisterContactOpenModule,
  ],
  providers: [
    ActionGridService,
  ],
  exports: [
    ActionGridComponent,
  ],
  declarations: [
    ActionGridComponent,
  ],
})
export class ActionGridModule {}
