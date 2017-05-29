import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { NotificationActions } from '../../core/notifications/notifications.actions';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DashboardComponent,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    NotificationActions,
  ]
})
export class DashboardModule { }
