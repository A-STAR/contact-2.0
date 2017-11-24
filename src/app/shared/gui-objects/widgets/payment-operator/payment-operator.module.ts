import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorConfirmDialogModule } from './dialog/confirm/operator-confirm-dialog.module';
import { OperatorRejectDialogModule } from './dialog/reject/operator-reject-dialog.module';

import { PaymentOperatorService } from './payment-operator.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    OperatorConfirmDialogModule,
    OperatorRejectDialogModule,
  ],
  providers: [
    PaymentOperatorService,
  ]
})
export class PaymentOperatorModule { }
