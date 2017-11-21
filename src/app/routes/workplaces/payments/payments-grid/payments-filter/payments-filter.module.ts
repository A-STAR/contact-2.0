import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsFilterComponent } from './payments-filter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ PaymentsFilterComponent ],
  declarations: [PaymentsFilterComponent]
})
export class PaymentsFilterModule { }
