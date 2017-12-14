import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { FormModule } from './form/form.module';
import { TabViewModule } from '../../../../../components/layout/tabview/tabview.module';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    FormModule,
    TabViewModule,
    TranslateModule,
  ],
  exports: [
    ScheduleComponent,
  ],
  declarations: [
    ScheduleComponent,
  ],
  entryComponents: [
    ScheduleComponent,
  ]
})
export class ScheduleModule { }
