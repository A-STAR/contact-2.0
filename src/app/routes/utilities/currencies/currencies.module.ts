import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CurrenciesGridModule } from './grid/currencies-grid.module';
import { CurrencyRatesModule } from './rates/currency-rates.module';

import { CurrenciesService } from './currencies.service';

import { CurrenciesComponent } from './currencies.component';


const routes: Routes = [
  {
    path: '',
    component: CurrenciesComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
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

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: './currencies.module#CurrenciesModule',
          },
          {
            path: 'create',
            loadChildren: './card/currency-card.module#CurrencyCardModule'
          },
          {
            path: ':currencyId',
            loadChildren: './card/currency-card.module#CurrencyCardModule'
          },
          {
            path: ':currencyId/rates/create',
            loadChildren: './rates/card/currency-rate-card.module#CurrencyRateCardModule'
          },
          {
            path: ':currencyId/rates/:currencyRateId',
            loadChildren: './rates/card/currency-rate-card.module#CurrencyRateCardModule'
          },
          {
            path: '**',
            redirectTo: ''
          },
        ]
      },
    ]),
  ]
})
export class RoutesModule {}
