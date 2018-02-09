import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleEventDialogModule } from './dialog/schedule-event-dialog.module';
import { ScheduleLogViewDialogModule } from './log/dialog/schedule-log-view-dialog.module';
import { SharedModule } from '@app/shared/shared.module';
// import { ScheduleEventGridModule } from './grid/schedule-event-grid.module';

import { ScheduleEventService } from './schedule-event.service';

import { ScheduleEventComponent } from './schedule-event.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleEventComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ScheduleEventDialogModule,
    ScheduleLogViewDialogModule,
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    ScheduleEventComponent
  ],
  providers: [
    ScheduleEventService
  ]
})
export class ScheduleEventModule { }
