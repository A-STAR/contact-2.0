import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormModule } from './form/form.module';
import { SharedModule } from '@app/shared/shared.module';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
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
