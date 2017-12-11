import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtCardModule } from './card/debt-card.module';
import { DebtGridModule } from './grid/debt-grid.module';

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
})
export class DebtModule { }
