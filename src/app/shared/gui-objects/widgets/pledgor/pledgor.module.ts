import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgorCardModule } from './card/pledgor-card.module';

import { PledgorService } from './pledgor.service';

@NgModule({
  imports: [
    PledgorCardModule,
    CommonModule,
  ],
  exports: [
    PledgorCardModule,
  ],
  providers: [
    PledgorService
  ]
})
export class PledgorModule { }
