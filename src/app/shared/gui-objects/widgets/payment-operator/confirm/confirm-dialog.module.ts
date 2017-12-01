import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';

import { OperatorConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
  ],
  exports: [
    OperatorConfirmDialogComponent,
  ],
  declarations: [
    OperatorConfirmDialogComponent,
  ],
  entryComponents: [
    OperatorConfirmDialogComponent,
  ]
})
export class OperatorConfirmDialogModule { }
