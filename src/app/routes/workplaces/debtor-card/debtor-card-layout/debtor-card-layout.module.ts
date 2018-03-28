import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';

import { WorkplacesSharedModule } from '../../shared/shared.module';

import { DebtorCardLayoutComponent } from './debtor-card-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorCardLayoutComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    DebtorCardLayoutComponent,
  ],
  exports: [
    RouterModule,
  ],
})
export class DebtorCardLayoutModule {}
