import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentConfirmDialogModule } from './dialog-confirm/payment-confirm-dialog.module';
import { PaymentCancelDialogModule } from './dialog-cancel/payment-cancel-dialog.module';

import { PaymentConfirmService } from './payment-confirm.service';

@NgModule({
  imports: [
    CommonModule,
    PaymentConfirmDialogModule,
    PaymentCancelDialogModule,
  ],
  exports: [
    PaymentConfirmDialogModule,
    PaymentCancelDialogModule,
  ],
  providers: [
    PaymentConfirmService,
  ]
})
export class PaymentConfirmModule { }
