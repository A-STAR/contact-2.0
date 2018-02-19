import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleModule } from './schedule/schedule.module';
import { SharedModule } from '@app/shared/shared.module';

import { EmailGridComponent } from './email-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ScheduleModule,
    SharedModule
  ],
  exports: [
    EmailGridComponent,
  ],
  declarations: [
    EmailGridComponent,
  ],
  entryComponents: [
    EmailGridComponent,
  ]
})
export class EmailGridModule { }
