import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CurrencyCardModule } from './card/currency-card.module';
import { CurrenciesGridModule } from './grid/currencies-grid.module';
import { CurrencyRatesModule } from './rates/currency-rates.module';

import { CurrenciesService } from './currencies.service';

import { CurrenciesComponent } from './currencies.component';
import { CurrencyCardComponent } from './card/currency-card.component';
import { CurrencyRateCardComponent } from './rates/card/currency-rate-card.component';


const routes: Routes = [
  {
    path: '',
    component: CurrenciesComponent,
    data: {
      reuse: true,
    },
  },
  { path: 'create', component: CurrencyCardComponent },
  { path: ':currencyId', component: CurrencyCardComponent },
  { path: ':currencyId/rates/create', component: CurrencyRateCardComponent },
  { path: ':currencyId/rates/:currencyRateId', component: CurrencyRateCardComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CurrencyCardModule,
    CurrenciesGridModule,
    CurrencyRatesModule
  ],
  declarations: [
    CurrenciesComponent,
  ],
  providers: [
    CurrenciesService
  ]
})
export class CurrenciesModule {}
