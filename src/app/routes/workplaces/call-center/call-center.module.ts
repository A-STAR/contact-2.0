import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { CallCenterComponent } from './call-center.component';

const routes: Routes = [
  {
    path: '',
    component: CallCenterComponent,
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
  exports: [
    RouterModule,
  ],
  declarations: [
    CallCenterComponent,
  ]
})
export class CallCenterModule {}
