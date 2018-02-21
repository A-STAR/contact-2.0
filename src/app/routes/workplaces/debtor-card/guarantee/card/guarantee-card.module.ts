import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuarantorModule } from '../guarantor/guarantor.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorGuaranteeCardComponent } from './guarantee-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GuarantorModule,
  ],
  exports: [
    DebtorGuaranteeCardComponent,
  ],
  declarations: [
    DebtorGuaranteeCardComponent,
  ]
})
export class GuaranteeCardModule { }
