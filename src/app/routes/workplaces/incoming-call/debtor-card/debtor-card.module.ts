import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorCardComponent } from './debtor-card.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DebtorCardComponent,
  ],
  exports: [
    DebtorCardComponent,
  ]
})
export class DebtorCardModule {}
