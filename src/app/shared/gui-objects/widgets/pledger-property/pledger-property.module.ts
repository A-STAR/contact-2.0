import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgerPropertyCardModule } from './card/pledger-property-card.module';

@NgModule({
  imports: [
    PledgerPropertyCardModule,
    CommonModule,
  ],
  exports: [
    PledgerPropertyCardModule,
  ],
  providers: [
  ]
})
export class PledgerPropertyModule { }
