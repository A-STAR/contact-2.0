import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleEventGridModule } from './grid/schedule-event-grid.module';

import { ScheduleEventService } from './schedule-event.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ScheduleEventGridModule,
  ],
  providers: [
    ScheduleEventService,
  ]
})
export class ScheduleEventModule { }
