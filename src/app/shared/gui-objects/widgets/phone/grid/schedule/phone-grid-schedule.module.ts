import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { PhoneGridScheduleFormModule } from './form/phone-grid-schedule-form.module';
import { TabstripModule } from '../../../../../components/tabstrip/tabstrip.module';

import { PhoneGridScheduleComponent } from './phone-grid-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    PhoneGridScheduleFormModule,
    TabstripModule,
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
