import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { CurrencyCardComponent } from './currency-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
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
