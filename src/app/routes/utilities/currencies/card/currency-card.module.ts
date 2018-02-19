import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';

import { CurrencyCardComponent } from './currency-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CurrencyCardComponent,
  ],
  declarations: [
    CurrencyCardComponent,
  ],
})
export class CurrencyCardModule { }
