import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtModule } from './debt/debt.module';

import { DebtsComponent } from './debts.component';

@NgModule({
  imports: [
    CommonModule,
    DebtModule,
    SharedModule,
  ],
  exports: [
    DebtsComponent,
  ],
  declarations: [
    DebtsComponent,
  ],
})
export class DebtsModule { }
