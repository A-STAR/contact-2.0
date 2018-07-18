import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { CanActivateTabGuard } from '@app/shared/components/layout/tabview/header/header.service';

import { ScheduleComponent } from './schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    data: {
      reuse: true,
      tabs: [
        { link: 'all', permission: 'GROUP_VIEW' },
        { link: 'debts', permission: 'GROUP_TAB_DEBT_GROUP' },
        { link: 'events', permission: 'SCHEDULE_VIEW' },
      ],
    },
    canActivate: [ CanActivateTabGuard ],
    canActivateChild: [ CanActivateTabGuard ],
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
