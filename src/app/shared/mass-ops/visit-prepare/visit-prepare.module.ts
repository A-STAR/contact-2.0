import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitCardModule } from './card/visit-card.module';
import { VisitOperatorGridModule } from './grid/visit-operator-grid.module';
import { VisitDialogModule } from './dialog/visit/visit-dialog.module';
import { VisitPrepareDialogModule } from './dialog/visit-prepare/visit-prepare-dialog.module';
import { VisitCancelDialogModule } from './dialog/visit-cancel/visit-cancel-dialog.module';

import { VisitPrepareService } from './visit-prepare.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    VisitCardModule,
    VisitOperatorGridModule,
    VisitDialogModule,
    VisitPrepareDialogModule,
    VisitCancelDialogModule,
  ],
  providers: [
    VisitPrepareService,
  ]
})
export class VisitPrepareModule { }
