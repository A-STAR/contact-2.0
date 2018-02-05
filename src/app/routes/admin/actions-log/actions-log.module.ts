import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ActionsLogService } from './actions-log.service';

import { ActionsLogComponent } from './actions-log.component';

const routes: Routes = [
  {
    path: '',
    component: ActionsLogComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ActionsLogComponent,
  ],
  providers: [
    ActionsLogService,
  ]
})
export class ActionsLogModule {}
