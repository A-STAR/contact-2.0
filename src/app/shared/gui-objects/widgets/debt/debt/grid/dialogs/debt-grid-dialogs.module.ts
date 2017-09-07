import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtGridCloseDialogModule } from './close/debt-grid-close-dialog.module';
import { DebtGridStatusDialogModule } from './status/debt-grid-status-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    DebtGridCloseDialogModule,
    DebtGridStatusDialogModule,
  ],
  exports: [
    DebtGridCloseDialogModule,
    DebtGridStatusDialogModule,
  ]
})
export class DebtGridDialogsModule { }
