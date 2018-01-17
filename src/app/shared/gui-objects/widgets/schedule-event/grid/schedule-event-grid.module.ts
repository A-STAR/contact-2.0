import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';

import { ScheduleEventGridComponent } from './schedule-event-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    ScheduleEventGridComponent,
  ],
  declarations: [
    ScheduleEventGridComponent,
  ],
  entryComponents: [
    ScheduleEventGridComponent,
  ]
})
export class ScheduleEventGridModule { }
