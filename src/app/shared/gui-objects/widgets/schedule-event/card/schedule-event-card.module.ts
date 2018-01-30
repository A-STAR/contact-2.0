import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { SchedulePeriodCardModule } from './period/schedule-period-card.module';
import { ScheduleTypeCardModule } from './type/schedule-type-card.module';

import { ScheduleEventCardComponent } from './schedule-event-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule,
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
  ]
})
export class ScheduleEventCardModule { }
