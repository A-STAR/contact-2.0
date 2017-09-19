import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../../../../../components/form/dynamic-form/dynamic-form.module';

import { PhoneGridScheduleTemplateComponent } from './phone-grid-schedule-template.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    PhoneGridScheduleTemplateComponent,
  ],
  declarations: [
    PhoneGridScheduleTemplateComponent,
  ],
  entryComponents: [
    PhoneGridScheduleTemplateComponent,
  ]
})
export class PhoneGridScheduleTemplateModule { }
