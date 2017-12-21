import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitDialogModule } from '../visit/visit-dialog.module';

import { VisitPrepareDialogComponent } from './visit-prepare-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    VisitDialogModule,
  ],
  exports: [
    VisitPrepareDialogComponent,
  ],
  declarations: [
    VisitPrepareDialogComponent,
  ],
  entryComponents: [
    VisitPrepareDialogComponent,
  ]
})
export class VisitPrepareDialogModule { }
