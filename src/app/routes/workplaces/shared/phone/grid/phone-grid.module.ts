import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockDialogModule } from '@app/shared/components/dialog/block/block-dialog.module';
import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridModule } from '@app/shared/components/grid/grid.module';
import { PhoneGridScheduleModule } from './schedule/phone-grid-schedule.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';
import { OperatorModule } from '../operator/operator.module';

import { PhoneGridComponent } from './phone-grid.component';

@NgModule({
  imports: [
    BlockDialogModule,
    CommonModule,
    DialogActionModule,
    GridModule,
    PhoneGridScheduleModule,
    Toolbar2Module,
    OperatorModule,
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
export class PhoneGridModule { }
