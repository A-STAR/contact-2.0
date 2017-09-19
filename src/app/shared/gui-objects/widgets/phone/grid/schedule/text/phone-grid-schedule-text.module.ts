import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../../../../../components/form/dynamic-form/dynamic-form.module';

import { PhoneGridScheduleTextComponent } from './phone-grid-schedule-text.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    PhoneGridScheduleTextComponent,
  ],
  declarations: [
    PhoneGridScheduleTextComponent,
  ],
  entryComponents: [
    PhoneGridScheduleTextComponent,
  ]
})
export class PhoneGridScheduleTextModule { }
