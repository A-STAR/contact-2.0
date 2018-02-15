import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleEventDialogModule } from '../../events/dialog/schedule-event-dialog.module';
import { ScheduleLogViewDialogModule } from '../../events/log/dialog/schedule-log-view-dialog.module';
import { SharedModule } from '@app/shared/shared.module';

import { GroupEventsComponent } from './group-events.component';

import { GroupEventService } from './group-events.service';
import { ScheduleEventService } from '../../events/schedule-event.service';

@NgModule({
  imports: [
    CommonModule,
    ScheduleEventDialogModule,
    ScheduleLogViewDialogModule,
    SharedModule,
  ],
  declarations: [
    GroupEventsComponent
  ],
  exports: [
    GroupEventsComponent
  ],
  providers: [
    GroupEventService,
    ScheduleEventService
  ]
})
export class GroupEventsModule { }
