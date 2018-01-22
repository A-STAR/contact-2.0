import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleEventGridModule } from './grid/schedule-event-grid.module';
import { ScheduleEventCardModule } from './card/schedule-event-card.module';
import { ScheduleEventDialogModule} from './dialog/schedule-event-dialog.module';

import { ScheduleEventService } from './schedule-event.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ScheduleEventGridModule,
    ScheduleEventCardModule,
    ScheduleEventDialogModule
  ],
  providers: [
    ScheduleEventService,
  ]
})
export class ScheduleEventModule { }
