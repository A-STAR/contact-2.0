import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';
import { ScheduleEventCardModule } from '../card/schedule-event-card.module';

import { ScheduleEventDialogComponent } from './schedule-event-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ScheduleEventCardModule,
  ],
  exports: [
    ScheduleEventDialogComponent
  ],
  declarations: [
    ScheduleEventDialogComponent
  ],
})
export class ScheduleEventDialogModule { }
