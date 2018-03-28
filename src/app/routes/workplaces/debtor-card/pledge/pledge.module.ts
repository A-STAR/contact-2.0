import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { PledgeCardModule } from './card/pledge-card.module';
import { PledgeGridModule } from './grid/pledge-grid.module';

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
})
export class DebtorPledgeModule {}
