import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebtorPledgeAttributesModule } from './attributes/pledge-attributes.module';
import { PledgeGridModule } from './grid/pledge-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { PledgeComponent } from './pledge.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PledgeGridModule,
    DebtorPledgeAttributesModule
  ],
  declarations: [ PledgeComponent ],
  exports: [ PledgeComponent ],
})
export class PledgeModule { }
