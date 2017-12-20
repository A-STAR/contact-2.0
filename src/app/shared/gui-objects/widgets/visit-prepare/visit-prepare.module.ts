import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitCardModule } from './card/visit-card.module';

import { VisitPrepareService } from './visit-prepare.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    VisitCardModule,
  ],
  providers: [
    VisitPrepareService,
  ]
})
export class VisitPrepareModule { }
