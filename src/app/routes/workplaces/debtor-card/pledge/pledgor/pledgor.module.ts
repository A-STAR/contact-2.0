import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgorCardModule } from './card/pledgor-card.module';
import { PledgorPropertyModule } from './property/pledgor-property.module';

import { PledgorService } from './pledgor.service';

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
  providers: [
    PledgorService
  ]
})
export class PledgorModule { }
