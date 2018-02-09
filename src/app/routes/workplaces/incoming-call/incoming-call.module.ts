import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtorCardModule } from './debtor-card/debtor-card.module';
import { DebtorGridModule } from './debtor-grid/debtor-grid.module';
import { FilterModule } from './filter/filter.module';
import { PhoneGridModule } from './phone-grid/phone-grid.module';
import { SharedModule } from '../../../shared/shared.module';
import { WorkplacesSharedModule } from '../shared/shared.module';

import { IncomingCallComponent } from './incoming-call.component';

const routes: Routes = [
  {
    path: '',
    component: IncomingCallComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'phone',
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', loadChildren: './phone-card/phone-card.module#PhoneCardModule' },
      { path: ':phoneId', loadChildren: './phone-card/phone-card.module#PhoneCardModule' },
    ]
  },
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
    IncomingCallComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class IncomingCallModule {}
