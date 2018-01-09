import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../../../components/button/button.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { CurrencyRateCardComponent } from './currency-rate-card.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DynamicFormModule
  ],
  exports: [
    CurrencyRateCardComponent,
  ],
  declarations: [
    CurrencyRateCardComponent,
  ],
  entryComponents: [
    CurrencyRateCardComponent,
  ]
})
export class CurrencyRateCardModule { }
