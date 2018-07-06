import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import {
  PledgeCardEditContractComponent,
} from '@app/routes/workplaces/debtor-card/pledge/card/edit-contract/edit-contract.component';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardEditContractComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  declarations: [
    PledgeCardEditContractComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
})
export class PledgeCardEditContractModule {}
