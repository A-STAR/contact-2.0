import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtGridModule } from './grid/debt-grid.module';

import { DebtService } from './debt.service';

@NgModule({
  imports: [
    DebtGridModule,
    CommonModule,
  ],
  exports: [
    DebtGridModule,
  ],
  providers: [
    DebtService,
  ]
})
export class DebtModule { }
