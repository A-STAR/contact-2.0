import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';
import { ScheduleEventDialogModule } from '@app/shared/gui-objects/widgets/schedule-event/dialog/schedule-event-dialog.module';

import { ScheduleEventGridComponent } from './schedule-event-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
    ScheduleEventDialogModule
  ],
  exports: [
    ScheduleEventGridComponent,
  ],
  declarations: [
    ScheduleEventGridComponent,
  ],
  entryComponents: [
    ScheduleEventGridComponent,
  ]
})
export class ScheduleEventGridModule { }
