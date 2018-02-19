import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { CurrencyRatesGridComponent } from './currency-rates-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CurrencyRatesGridComponent,
  ],
  declarations: [
    CurrencyRatesGridComponent,
  ],
})
export class CurrencyRatesGridModule { }
