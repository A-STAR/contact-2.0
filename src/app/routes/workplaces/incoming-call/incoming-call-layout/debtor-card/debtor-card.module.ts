import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorCardService } from './debtor-card.service';

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
  ],
  providers: [
    DebtorCardService,
  ]
})
export class DebtorCardModule {}
