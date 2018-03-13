import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';

import { PaymentOperatorService } from './payment-operator.service';

import { OperatorConfirmDialogComponent } from './confirm/confirm-dialog.component';
import { OperatorRejectDialogComponent } from './reject/reject-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
  ],
  exports: [
    OperatorConfirmDialogComponent,
    OperatorRejectDialogComponent,
  ],
  declarations: [
    OperatorConfirmDialogComponent,
    OperatorRejectDialogComponent,
  ],
  providers: [
    PaymentOperatorService,
  ]
})
export class PaymentOperatorModule { }
