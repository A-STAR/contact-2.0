import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ScheduleComponent } from './schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all'
      },
      {
        path: 'all',
        loadChildren: './groups/groups.module#GroupsModule'
      },
      {
        path: 'debts',
        loadChildren: './group-debts/group-debts.module#GroupDebtsModule',
      },
      {
        path: 'schedule',
        loadChildren: './events/schedule-event.module#ScheduleEventModule',
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ScheduleComponent,
  ],
})
export class ScheduleModule {}
