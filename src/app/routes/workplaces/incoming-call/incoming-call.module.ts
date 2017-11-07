import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtorsGridModule } from './debtors-grid/debtors-grid.module';
import { FilterModule } from './filter/filter.module';
import { SharedModule } from '../../../shared/shared.module';

import { IncomingCallComponent } from './incoming-call.component';

const routes: Routes = [
  { path: '', component: IncomingCallComponent },
];

@NgModule({
  imports: [
    DebtorsGridModule,
    FilterModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    IncomingCallComponent,
  ]
})
export class IncomingCallModule {}
