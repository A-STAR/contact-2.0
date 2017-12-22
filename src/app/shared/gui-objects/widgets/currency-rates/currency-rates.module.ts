import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyRatesGridModule } from './grid/currency-rates-grid.module';

import { CurrencyRatesService } from './currency-rates.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CurrencyRatesGridModule,
  ],
  providers: [
    CurrencyRatesService,
  ]
})
export class CurrencyRatesModule { }
