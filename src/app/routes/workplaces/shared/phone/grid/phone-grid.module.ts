import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockDialogModule } from '@app/shared/components/dialog/block/block-dialog.module';
import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';
import { PhoneGridScheduleModule } from './schedule/phone-grid-schedule.module';
import { Toolbar2Module } from '@app/shared/components/toolbar/toolbar.module';
import { OperatorModule } from '@app/shared/components/operator/operator.module';

import { PhoneGridComponent } from './phone-grid.component';

@NgModule({
  imports: [
    BlockDialogModule,
    CommonModule,
    DialogActionModule,
    GridsModule,
    PhoneGridScheduleModule,
    Toolbar2Module,
    OperatorModule
  ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent,
  ],
  entryComponents: [
    PhoneGridComponent,
  ]
})
export class PhoneGridModule {}
