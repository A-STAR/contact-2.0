import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgorCardModule } from './card/pledgor-card.module';
import { PledgorPropertyModule } from './property/pledgor-property.module';

@NgModule({
  imports: [
    PledgorCardModule,
    PledgorPropertyModule,
    CommonModule,
  ],
  exports: [
    PledgorCardModule,
    PledgorPropertyModule,
  ],
})
export class PledgorModule {}
