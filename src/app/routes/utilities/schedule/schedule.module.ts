import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ScheduleEditModule } from './edit/edit.module';

import { ScheduleComponent } from './schedule.component';
import { ScheduleEditComponent } from './edit/edit.component';

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
  ],
  declarations: [
    ScheduleComponent,
  ],
})
export class ScheduleModule {}
