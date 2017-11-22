import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';
import { PaymentsFilterModule } from './payments-filter/payments-filter.module';

import { PaymentsGridComponent } from './payments-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PaymentsFilterModule
  ],
  exports: [PaymentsGridComponent],
  declarations: [PaymentsGridComponent]
})
export class PaymentsGridModule { }
