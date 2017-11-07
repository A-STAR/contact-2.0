import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { IncomingCallComponent } from './incoming-call.component';

const routes: Routes = [
  { path: '', component: IncomingCallComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    IncomingCallComponent,
  ]
})
export class IncomingCallModule {}
