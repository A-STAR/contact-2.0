import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuaranteeCardModule } from './card/guarantee-card.module';
import { GuaranteeGridModule } from './grid/guarantee-grid.module';

@NgModule({
  imports: [
    CommonModule,
    GuaranteeCardModule,
    GuaranteeGridModule,
  ],
  exports: [
    GuaranteeCardModule,
    GuaranteeGridModule,
  ],
})
export class DebtorGuaranteeModule {}
