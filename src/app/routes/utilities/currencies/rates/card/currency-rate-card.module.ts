import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { CurrencyRateCardComponent } from './currency-rate-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CurrencyRateCardComponent,
  ],
  declarations: [
    CurrencyRateCardComponent,
  ],
})
export class CurrencyRateCardModule { }
