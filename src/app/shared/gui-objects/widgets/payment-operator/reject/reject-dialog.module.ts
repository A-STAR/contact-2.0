import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';

import { OperatorRejectDialogComponent } from './reject-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
  ],
  exports: [
    OperatorRejectDialogComponent,
  ],
  declarations: [
    OperatorRejectDialogComponent,
  ],
  entryComponents: [
    OperatorRejectDialogComponent,
  ]
})
export class OperatorRejectDialogModule { }
