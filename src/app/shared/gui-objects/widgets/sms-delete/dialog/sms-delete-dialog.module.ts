import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { ResultDialogModule } from '../../../../components/dialog/result/result-dialog.module';

import { SmsDeleteDialogComponent } from './sms-delete-dialog.component';

@NgModule({
  imports: [
    DialogActionModule,
    CommonModule,
    ResultDialogModule,
  ],
  exports: [
    SmsDeleteDialogComponent,
  ],
  declarations: [
    SmsDeleteDialogComponent,
  ]
})
export class SmsDeleteDialogModule { }
