import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../../../../components/button/button.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { CurrencyCardComponent } from './currency-card.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DynamicFormModule
  ],
  exports: [
    CurrencyCardComponent,
  ],
  declarations: [
    CurrencyCardComponent,
  ],
  entryComponents: [
    CurrencyCardComponent,
  ]
})
export class CurrencyCardModule { }
