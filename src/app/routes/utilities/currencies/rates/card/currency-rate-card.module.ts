import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../../../shared/shared.module';

import { CurrencyRatesService } from '../currency-rates.service';

import { CurrencyRateCardComponent } from './currency-rate-card.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyRateCardComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    CurrencyRateCardComponent,
  ],
  declarations: [
    CurrencyRateCardComponent,
  ],
  providers: [
    CurrencyRatesService
  ]
})
export class CurrencyRateCardModule { }
