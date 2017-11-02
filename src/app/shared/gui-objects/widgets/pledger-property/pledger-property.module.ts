import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PledgerPropertyCardModule } from './card/pledger-property-card.module';
import { PledgerPropertyGridModule } from './grid/pledger-property-grid.module';

import { PledgerPropertyService } from './pledger-property.service';

@NgModule({
  imports: [
    PledgerPropertyCardModule,
    PledgerPropertyGridModule,
    CommonModule,
  ],
  exports: [
    PledgerPropertyCardModule,
    PledgerPropertyGridModule,
  ],
  providers: [
    PledgerPropertyService
  ]
})
export class PledgerPropertyModule { }
