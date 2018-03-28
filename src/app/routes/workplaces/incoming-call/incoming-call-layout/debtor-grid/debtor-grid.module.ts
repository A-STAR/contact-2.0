import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorGridService } from './debtor-grid.service';

import { DebtorGridComponent } from './debtor-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DebtorGridComponent,
  ],
  exports: [
    DebtorGridComponent,
  ],
  providers: [
    DebtorGridService,
  ]
})
export class DebtorGridModule {}
