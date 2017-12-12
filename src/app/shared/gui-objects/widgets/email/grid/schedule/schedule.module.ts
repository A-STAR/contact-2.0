import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { FormModule } from './form/form.module';
import { TabstripModule } from '../../../../../components/tabstrip/tabstrip.module';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    FormModule,
    TabstripModule,
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
