import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FormModule } from './form/form.module';
import { SharedModule } from '@app/shared/shared.module';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    TranslateModule,
    SharedModule
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
