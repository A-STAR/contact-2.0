import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { VisitDialogModule } from '../visit/visit-dialog.module';

import { VisitPrepareDialogComponent } from './visit-prepare-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
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
