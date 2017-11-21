import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsGridComponent } from './payments-grid.component';
import { PaymentsFilterModule } from './payments-filter/payments-filter.module';

@NgModule({
  imports: [
    CommonModule,
    PaymentsFilterModule
  ],
  exports: [PaymentsGridComponent],
  declarations: [PaymentsGridComponent]
})
export class PaymentsGridModule { }
