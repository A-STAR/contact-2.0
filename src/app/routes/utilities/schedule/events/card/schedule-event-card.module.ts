import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';
import { SchedulePeriodCardModule } from './period/schedule-period-card.module';
import { ScheduleTypeCardModule } from './type/schedule-type-card.module';

import { ScheduleEventCardComponent } from './schedule-event-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SchedulePeriodCardModule,
    ScheduleTypeCardModule,
  ],
  exports: [
    ScheduleEventCardComponent,
  ],
  declarations: [
    ScheduleEventCardComponent,
  ],
  entryComponents: [
    ScheduleEventCardComponent,
  ],
})
export class ScheduleEventCardModule { }
