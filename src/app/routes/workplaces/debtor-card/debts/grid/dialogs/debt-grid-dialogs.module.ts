import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtGridCallDialogModule } from './call/debt-grid-call-dialog.module';
import { DebtGridCloseDialogModule } from './close/debt-grid-close-dialog.module';
import { DebtGridStatusDialogModule } from './status/debt-grid-status-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    DebtGridCallDialogModule,
    DebtGridCloseDialogModule,
    DebtGridStatusDialogModule,
  ],
  exports: [
    DebtGridCallDialogModule,
    DebtGridCloseDialogModule,
    DebtGridStatusDialogModule,
  ]
})
export class DebtGridDialogsModule { }
