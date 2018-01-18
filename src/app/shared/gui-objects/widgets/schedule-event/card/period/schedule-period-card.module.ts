import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';

import { SchedulePeriodCardComponent } from './schedule-period-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule
  ],
  exports: [
    SchedulePeriodCardComponent,
  ],
  declarations: [
    SchedulePeriodCardComponent,
  ],
  entryComponents: [
    SchedulePeriodCardComponent,
  ]
})
export class SchedulePeriodCardModule { }
