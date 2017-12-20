import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtStatusService } from './debt-status.service';

import { DebtStatusComponent } from './dialog/debt-status.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [DebtStatusService],
  declarations: [DebtStatusComponent]
})
export class DebtStatusModule { }
