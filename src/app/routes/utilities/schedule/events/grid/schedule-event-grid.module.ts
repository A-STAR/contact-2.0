import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';
import { ScheduleEventDialogModule } from '../dialog/schedule-event-dialog.module';
import { ScheduleLogViewDialogModule } from '../log/dialog/schedule-log-view-dialog.module';

import { ScheduleEventGridComponent } from './schedule-event-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ScheduleEventDialogModule,
    ScheduleLogViewDialogModule
  ],
  exports: [
    ScheduleEventGridComponent,
  ],
  declarations: [
    ScheduleEventGridComponent,
  ],
})
export class ScheduleEventGridModule { }
