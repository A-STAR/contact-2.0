import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../../components/dialog-action/dialog-action.module';

import { PromiseConfirmDialogComponent } from './promise-confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
  ],
  exports: [
    PromiseConfirmDialogComponent,
  ],
  declarations: [
    PromiseConfirmDialogComponent,
  ],
  entryComponents: [
    PromiseConfirmDialogComponent,
  ]
})
export class PromiseConfirmDialogModule { }
