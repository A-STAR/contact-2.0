import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuarantorCardModule } from './card/guarantor-card.module';
import { GuarantorGridModule } from './grid/guarantor-grid.module';

@NgModule({
  imports: [
    GuarantorCardModule,
    GuarantorGridModule,
    CommonModule,
  ],
  exports: [
    GuarantorCardModule,
    GuarantorGridModule,
  ],
})
export class GuarantorModule {}
