import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { ScheduleEventGridComponent } from './schedule-event-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    Toolbar2Module,
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
