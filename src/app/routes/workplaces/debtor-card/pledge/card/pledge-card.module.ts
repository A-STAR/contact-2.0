import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { PledgorModule } from '../pledgor/pledgor.module';

import { DebtorPledgeCardComponent } from './pledge-card.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorPledgeCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PledgorModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorPledgeCardComponent,
  ],
})
export class PledgeCardModule {}
