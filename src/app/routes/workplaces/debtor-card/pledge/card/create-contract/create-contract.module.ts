import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import {
  PledgeCardCreateContractComponent,
} from '@app/routes/workplaces/debtor-card/pledge/card/create-contract/create-contract.component';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardCreateContractComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  declarations: [
    PledgeCardCreateContractComponent,
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
export class PledgeCardCreateContractModule {}
