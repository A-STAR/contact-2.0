import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';

import { PaymentCancelDialogComponent } from './cancel/cancel-dialog.component';
import { PaymentConfirmDialogComponent } from './confirm/confirm-dialog.component';

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
