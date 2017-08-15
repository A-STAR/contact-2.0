import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtGridStatusDialogModule } from './status/debt-grid-status-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    DebtGridStatusDialogModule,
  ],
  exports: [
    DebtGridStatusDialogModule,
  ]
})
export class DebtGridDialogsModule { }
