import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { CurrencyRateCardComponent } from './currency-rate-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
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
