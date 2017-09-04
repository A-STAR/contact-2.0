import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtModule as DebtMainModule } from './debt/debt.module';

@NgModule({
  imports: [
    DebtMainModule,
    CommonModule,
  ],
  exports: [
    DebtMainModule,
  ]
})
export class DebtModule { }
