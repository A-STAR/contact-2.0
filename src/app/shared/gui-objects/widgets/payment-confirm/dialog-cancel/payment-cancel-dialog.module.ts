import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { ResultDialogModule } from '../../../../components/dialog/result/result-dialog.module';


import { PaymentCancelDialogComponent } from './payment-cancel-dialog.component';


@NgModule({
  imports: [
    DialogModule,
    DialogActionModule,
    TranslateModule,
    CommonModule,
    ResultDialogModule,
  ],
  exports: [
    PaymentCancelDialogComponent,
  ],
  declarations: [
    PaymentCancelDialogComponent,
  ]
})
export class PaymentCancelDialogModule { }
