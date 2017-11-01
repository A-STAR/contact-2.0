import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgerCardModule } from './card/pledger-card.module';

import { PledgerService } from './pledger.service';

@NgModule({
  imports: [
    PledgerCardModule,
    CommonModule,
  ],
  exports: [
    PledgerCardModule,
  ],
  providers: [
    PledgerService
  ]
})
export class PledgerModule { }
