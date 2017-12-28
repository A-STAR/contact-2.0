import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrenciesGridModule } from './grid/currencies-grid.module';
import { CurrencyCardModule } from './card/currency-card.module';

import { CurrenciesService } from './currencies.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CurrenciesGridModule,
    CurrencyCardModule,
  ],
  providers: [
    CurrenciesService,
  ]
})
export class CurrenciesModule { }

