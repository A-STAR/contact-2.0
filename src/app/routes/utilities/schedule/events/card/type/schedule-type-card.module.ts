import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../../shared/shared.module';

import { ScheduleTypeCardComponent } from './schedule-type-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ScheduleTypeCardComponent,
  ],
  declarations: [
    ScheduleTypeCardComponent,
  ],
  entryComponents: [
    ScheduleTypeCardComponent,
  ],
})
export class ScheduleTypeCardModule { }
