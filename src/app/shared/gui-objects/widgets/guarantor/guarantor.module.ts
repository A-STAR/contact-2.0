import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuarantorCardModule } from './card/guarantor-card.module';
import { GuarantorGridModule } from './grid/guarantor-grid.module';

import { GuarantorService } from './guarantor.service';

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
  providers: [
    GuarantorService
  ]
})
export class GuarantorModule { }
