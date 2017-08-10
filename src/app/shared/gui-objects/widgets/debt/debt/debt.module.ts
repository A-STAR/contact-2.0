import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtCardModule } from './card/debt-card.module';
import { DebtGridModule } from './grid/debt-grid.module';

import { DebtService } from './debt.service';

@NgModule({
  imports: [
    DebtCardModule,
    DebtGridModule,
    CommonModule,
  ],
  exports: [
    DebtCardModule,
    DebtGridModule,
  ],
  providers: [
    DebtService,
  ]
})
export class DebtModule { }
