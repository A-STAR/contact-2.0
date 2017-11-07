import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtorGridModule } from './debtor-grid/debtor-grid.module';
import { FilterModule } from './filter/filter.module';
import { PhoneGridModule } from './phone-grid/phone-grid.module';
import { SharedModule } from '../../../shared/shared.module';

import { IncomingCallComponent } from './incoming-call.component';

const routes: Routes = [
  { path: '', component: IncomingCallComponent },
];

@NgModule({
  imports: [
    DebtorGridModule,
    FilterModule,
    PhoneGridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    IncomingCallComponent,
  ]
})
export class IncomingCallModule {}
