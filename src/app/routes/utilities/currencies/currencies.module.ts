import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CurrencyEditModule } from './edit/edit.module';
import { CurrencyRateEditModule } from './rate/rate.module';

import { CurrenciesComponent } from './currencies.component';
import { CurrencyEditComponent } from './edit/edit.component';
import { CurrencyRateEditComponent } from './rate/rate.component';

const routes: Routes = [
  {
    path: '',
    component: CurrenciesComponent,
    data: {
      reuse: true,
    },
  },
  { path: 'create', component: CurrencyEditComponent },
  { path: ':currencyId', component: CurrencyEditComponent },
  { path: ':currencyId/rates/create', component: CurrencyRateEditComponent },
  { path: ':currencyId/rates/:currencyRateId', component: CurrencyRateEditComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CurrencyEditModule,
    CurrencyRateEditModule,
  ],
  declarations: [
    CurrenciesComponent,
  ],
})
export class CurrenciesModule {}
