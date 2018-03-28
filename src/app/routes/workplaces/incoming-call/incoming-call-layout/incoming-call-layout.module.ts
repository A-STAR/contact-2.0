import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtorCardModule } from './debtor-card/debtor-card.module';
import { DebtorGridModule } from './debtor-grid/debtor-grid.module';
import { FilterModule } from './filter/filter.module';
import { PhoneGridModule } from './phone-grid/phone-grid.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '../../shared/shared.module';

import { IncomingCallLayoutComponent } from './incoming-call-layout.component';

const routes: Routes = [
  {
    path: '',
    component: IncomingCallLayoutComponent,
    data: {
      reuse: true,
    },
  }
];

@NgModule({
  imports: [
    DebtorCardModule,
    DebtorGridModule,
    FilterModule,
    PhoneGridModule,
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    IncomingCallLayoutComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class IncomingCallLayoutModule {}
