import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorsGridComponent } from './debtors-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DebtorsGridComponent,
  ],
  exports: [
    DebtorsGridComponent,
  ]
})
export class DebtorsGridModule {}
