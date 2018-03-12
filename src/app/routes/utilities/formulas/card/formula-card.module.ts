import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { FormulaCardComponent } from './formula-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    FormulaCardComponent,
  ],
  exports: [
    FormulaCardComponent,
  ]
})
export class FormulaCardModule { }
