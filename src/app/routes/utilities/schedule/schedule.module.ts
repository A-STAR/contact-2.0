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
        path: 'events',
        loadChildren: './events/schedule-event.module#ScheduleEventModule',
      }
    ],
  },
  {
    path: 'all/create',
    loadChildren: './groups/card/group-card.module#GroupCardModule',
  },
  {
    path: 'all/:groupId',
    loadChildren: './groups/card/group-card.module#GroupCardModule',
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
