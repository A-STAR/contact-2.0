import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import {
  PledgeCardCreatePropertyComponent,
} from '@app/routes/workplaces/debtor-card/pledge/card/create-property/create-property.component';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardCreatePropertyComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  declarations: [
    PledgeCardCreatePropertyComponent,
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
export class PledgeCardCreatePropertyModule {}
