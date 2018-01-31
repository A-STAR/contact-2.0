import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';
import { ScheduleEventDialogModule } from '../dialog/schedule-event-dialog.module';

import { ScheduleEventGridComponent } from './schedule-event-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ScheduleEventDialogModule
  ],
  exports: [
    ScheduleEventGridComponent,
  ],
  declarations: [
    ScheduleEventGridComponent,
  ],
})
export class ScheduleEventGridModule { }
