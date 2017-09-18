import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockDialogModule } from '../../../../components/dialog/block/block-dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { PhoneGridScheduleModule } from './schedule/phone-grid-schedule.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { PhoneGridComponent } from './phone-grid.component';

@NgModule({
  imports: [
    BlockDialogModule,
    CommonModule,
    DialogActionModule,
    GridModule,
    PhoneGridScheduleModule,
    Toolbar2Module,
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
