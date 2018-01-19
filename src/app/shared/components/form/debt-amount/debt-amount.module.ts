import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DebtAmountComponent } from './debt-amount.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DebtAmountComponent,
  ],
  declarations: [
    DebtAmountComponent,
  ],
})
export class DebtAmountModule {}
