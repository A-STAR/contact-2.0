import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { PhoneGridScheduleFormModule } from './form/phone-grid-schedule-form.module';
import { TabViewModule } from '../../../../../components/layout/tabview/tabview.module';

import { PhoneGridScheduleComponent } from './phone-grid-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    PhoneGridScheduleFormModule,
    TabViewModule,
    TranslateModule,
  ],
  exports: [
    PhoneGridScheduleComponent,
  ],
  declarations: [
    PhoneGridScheduleComponent,
  ],
  entryComponents: [
    PhoneGridScheduleComponent,
  ]
})
export class PhoneGridScheduleModule { }
