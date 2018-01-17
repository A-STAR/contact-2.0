import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { ScheduleEventCardComponent } from './schedule-event-card.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    TranslateModule,
    DynamicFormModule
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
