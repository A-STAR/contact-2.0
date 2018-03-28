import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgorPropertyCardModule } from './card/pledgor-property-card.module';
import { PledgorPropertyGridModule } from './grid/pledgor-property-grid.module';

@NgModule({
  imports: [
    PledgorPropertyCardModule,
    PledgorPropertyGridModule,
    CommonModule,
  ],
  exports: [
    PledgorPropertyCardModule,
    PledgorPropertyGridModule,
  ],
})
export class PledgorPropertyModule { }
