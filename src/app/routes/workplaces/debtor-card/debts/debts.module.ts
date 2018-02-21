import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtGridModule } from './grid/debt-grid.module';

import { DebtsComponent } from './debts.component';

@NgModule({
  imports: [
    CommonModule,
    DebtGridModule,
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    DebtsComponent,
  ],
  exports: [
    DebtsComponent,
  ]
})
export class DebtsModule {}
