import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitCardModule } from './card/visit-card.module';
import { VisitOperatorGridModule } from './grid/visit-operator-grid.module';

import { VisitPrepareService } from './visit-prepare.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    VisitCardModule,
    VisitOperatorGridModule,
  ],
  providers: [
    VisitPrepareService,
  ]
})
export class VisitPrepareModule { }
