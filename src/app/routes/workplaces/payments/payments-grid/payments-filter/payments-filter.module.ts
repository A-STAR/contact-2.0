import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { PaymentsFilterComponent } from './payments-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ PaymentsFilterComponent ],
  declarations: [PaymentsFilterComponent]
})
export class PaymentsFilterModule { }
