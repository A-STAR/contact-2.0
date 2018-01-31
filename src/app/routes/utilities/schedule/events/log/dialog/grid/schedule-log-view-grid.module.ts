import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@app/shared/components/grid/grid.module';

import { ScheduleLogViewGridComponent } from './schedule-log-view-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    ScheduleLogViewGridComponent,
  ],
  declarations: [
    ScheduleLogViewGridComponent,
  ]
})
export class ScheduleLogViewGridModule { }
