import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyRatesGridModule } from './grid/currency-rates-grid.module';
import { CurrencyRateCardModule } from './card/currency-rate-card.module';
import { SharedModule } from '../../../../shared/shared.module';

import { CurrencyRatesService } from './currency-rates.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
