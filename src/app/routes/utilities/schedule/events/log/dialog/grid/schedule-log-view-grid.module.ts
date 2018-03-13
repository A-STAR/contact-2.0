import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsModule } from '@app/shared/components/grids/grids.module';

import { ScheduleLogViewGridComponent } from './schedule-log-view-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridsModule,
  ],
  exports: [
    ScheduleLogViewGridComponent,
  ],
  declarations: [
    ScheduleLogViewGridComponent,
  ]
})
export class ScheduleLogViewGridModule {}
