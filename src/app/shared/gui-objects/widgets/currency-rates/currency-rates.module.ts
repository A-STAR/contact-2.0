import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyRatesGridModule } from './grid/currency-rates-grid.module';
import { CurrencyRateCardModule } from './card/currency-rate-card.module';

import { CurrencyRatesService } from './currency-rates.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CurrencyRatesGridModule,
    CurrencyRateCardModule,
  ],
  providers: [
    CurrencyRatesService,
  ]
})
export class CurrencyRatesModule { }
