import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorPledgeAttributesComponent } from './pledge-attributes.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorPledgeAttributesComponent
  ],
  declarations: [
    DebtorPledgeAttributesComponent
  ],
  entryComponents: [
    DebtorPledgeAttributesComponent,
  ]
})
export class DebtorPledgeAttributesModule {}
