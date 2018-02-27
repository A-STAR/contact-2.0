import { NgModule } from '@angular/core';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorPledgeAttributesComponent } from './pledge-attributes.component';

@NgModule({
  imports: [
    RoutesSharedModule,
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
