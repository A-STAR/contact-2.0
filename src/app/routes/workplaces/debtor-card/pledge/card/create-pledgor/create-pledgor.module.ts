import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import {
  PledgeCardCreatePledgorComponent,
} from '@app/routes/workplaces/debtor-card/pledge/card/create-pledgor/create-pledgor.component';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardCreatePledgorComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  declarations: [
    PledgeCardCreatePledgorComponent,
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
export class PledgeCardCreatePledgorModule {}
