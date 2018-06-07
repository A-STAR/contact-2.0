import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleModule } from './schedule/schedule.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { EmailGridComponent } from './email-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ScheduleModule,
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    EmailGridComponent,
  ],
  declarations: [
    EmailGridComponent,
  ],
})
export class EmailGridModule {}
