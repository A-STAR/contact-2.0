import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangesConfirmDialogModule } from './dialog/confirm/changes-confirm-dialog.module';
import { ChangesRejectDialogModule } from './dialog/reject/changes-reject-dialog.module';

import { PaymentsChangesService } from './payments-changes.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ChangesConfirmDialogModule,
    ChangesRejectDialogModule,
  ],
  providers: [
    PaymentsChangesService,
  ]
})
export class PaymentsChangesModule { }
