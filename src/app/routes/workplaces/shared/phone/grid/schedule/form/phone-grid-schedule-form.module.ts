import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { PhoneGridScheduleFormComponent } from './phone-grid-schedule-form.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    PhoneGridScheduleFormComponent,
  ],
  declarations: [
    PhoneGridScheduleFormComponent,
  ],
  entryComponents: [
    PhoneGridScheduleFormComponent,
  ]
})
export class PhoneGridScheduleFormModule { }
