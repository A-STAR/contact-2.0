import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

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
  ]
})
export class DebtorGridModule {}
