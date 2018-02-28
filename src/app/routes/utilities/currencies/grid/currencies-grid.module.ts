import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { CurrenciesGridComponent } from './currencies-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CurrenciesGridComponent,
  ],
  declarations: [
    CurrenciesGridComponent,
  ],
  entryComponents: [
    CurrenciesGridComponent,
  ]
})
export class CurrenciesGridModule { }
