import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../../components/dialog-action/dialog-action.module';

import { PromiseRemoveDialogComponent } from './promise-remove-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
  ],
  exports: [
    PromiseRemoveDialogComponent,
  ],
  declarations: [
    PromiseRemoveDialogComponent,
  ],
  entryComponents: [
    PromiseRemoveDialogComponent,
  ]
})
export class PromiseRemoveDialogModule { }
