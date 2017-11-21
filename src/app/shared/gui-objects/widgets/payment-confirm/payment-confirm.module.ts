import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentConfirmDialogModule } from './dialog/payment-confirm-dialog.module';

import { PaymentConfirmService } from './payment-confirm.service';

@NgModule({
  imports: [
    CommonModule,
    PaymentConfirmDialogModule,
  ],
  exports: [
    PaymentConfirmDialogModule,
  ],
  providers: [
    PaymentConfirmService,
  ]
})
export class PaymentConfirmModule { }
