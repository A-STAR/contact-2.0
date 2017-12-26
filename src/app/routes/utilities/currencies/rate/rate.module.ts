import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { CurrencyRateEditComponent } from './rate.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    CurrencyRateEditComponent
  ],
  declarations: [
    CurrencyRateEditComponent
  ],
})
export class RateEditModule { }
