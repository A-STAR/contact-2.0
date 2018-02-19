import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { PledgeCardModule } from './card/pledge-card.module';
import { PledgeGridModule } from './grid/pledge-grid.module';

import { PledgeService } from './pledge.service';

@NgModule({
  imports: [
    SharedModule,
    PledgeCardModule,
    PledgeGridModule,
  ],
  exports: [
    PledgeCardModule,
    PledgeGridModule
  ],
  providers: [
    PledgeService
  ]
})
export class DebtorPledgeModule {}
