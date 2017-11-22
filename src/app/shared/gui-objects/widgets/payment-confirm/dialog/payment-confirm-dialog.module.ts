import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { SharedModule } from '../../../../../shared/shared.module';


import { PaymentConfirmDialogComponent } from './payment-confirm-dialog.component';


@NgModule({
  imports: [
    DialogModule,
    DialogActionModule,
    TranslateModule,
    CommonModule,
    // SharedModule
  ],
  exports: [
    PaymentConfirmDialogComponent,
  ],
  declarations: [
    PaymentConfirmDialogComponent,
  ]
})
export class PaymentConfirmDialogModule { }
