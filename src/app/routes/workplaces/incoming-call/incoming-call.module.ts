import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterModule } from './filter/filter.module';
import { SharedModule } from '../../../shared/shared.module';

import { IncomingCallComponent } from './incoming-call.component';

const routes: Routes = [
  { path: '', component: IncomingCallComponent },
];

@NgModule({
  imports: [
    FilterModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    IncomingCallComponent,
  ]
})
export class IncomingCallModule {}
