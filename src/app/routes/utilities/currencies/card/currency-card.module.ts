import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';

import { CurrenciesService } from '../currencies.service';

import { CurrencyCardComponent } from './currency-card.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyCardComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    CurrencyCardComponent,
  ],
  declarations: [
    CurrencyCardComponent,
  ],
  providers: [
    CurrenciesService
  ]
})
export class CurrencyCardModule { }
