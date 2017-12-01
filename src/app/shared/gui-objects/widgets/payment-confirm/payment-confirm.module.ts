import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../components/dialog-action/dialog-action.module';

import { PaymentCancelDialogComponent } from './dialog-cancel/payment-cancel-dialog.component';
import { PaymentConfirmDialogComponent } from './dialog-confirm/payment-confirm-dialog.component';

import { PaymentConfirmService } from './payment-confirm.service';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
  ],
  declarations: [
    PaymentCancelDialogComponent,
    PaymentConfirmDialogComponent,
  ],
  exports: [
    PaymentCancelDialogComponent,
    PaymentConfirmDialogComponent,
  ],
  providers: [
    PaymentConfirmService,
  ]
})
export class PaymentConfirmModule { }
