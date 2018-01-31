import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@app/shared/components/grid/grid.module';

import { ScheduleLogViewGridComponent } from '@app/routes/utilities/schedule/log/dialog/grid/schedule-log-view-grid.component';

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
  ],
  entryComponents: [
    ScheduleLogViewGridComponent,
  ]
})
export class ScheduleLogViewGridModule { }
