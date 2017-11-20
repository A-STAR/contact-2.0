import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorPledgeComponent } from './pledge.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorPledgeComponent
  ],
  declarations: [
    DebtorPledgeComponent
  ],
})
export class DebtorPledgeModule {}
