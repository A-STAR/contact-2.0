import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { CallCenterComponent } from './call-center.component';

const routes: Routes = [
  { path: '', component: CallCenterComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    CallCenterComponent,
  ]
})
export class CallCenterModule {}
