import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../../../shared/components/dialog/dialog.module';

import { DebtStatusService } from './debt-status.service';

import { DebtStatusComponent } from './dialog/debt-status.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule
  ],
  providers: [DebtStatusService],
  declarations: [DebtStatusComponent],
  exports: [DebtStatusComponent]
})
export class DebtStatusModule { }
