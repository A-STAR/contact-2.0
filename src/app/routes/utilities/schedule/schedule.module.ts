import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { ScheduleEditModule } from '@app/routes/utilities/schedule/edit/edit.module';
import { ScheduleLogViewDialogModule } from '@app/routes/utilities/schedule/dialog/schedule-log-view-dialog.module';

import { ScheduleComponent } from '@app/routes/utilities/schedule/schedule.component';
import { ScheduleEditComponent } from '@app/routes/utilities/schedule/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    data: {
      reuse: true,
    },
  },
  { path: 'create', component: ScheduleEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    ScheduleEditModule,
    ScheduleLogViewDialogModule,
  ],
  declarations: [
    ScheduleComponent,
  ],
})
export class ScheduleModule {}
