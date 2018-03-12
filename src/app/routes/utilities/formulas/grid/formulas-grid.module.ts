import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { FormulaCalculateModule } from '../calculate/calculate-dialog.module';

import { FormulasGridComponent } from './formulas-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormulaCalculateModule
  ],
  exports: [
    FormulasGridComponent,
  ],
  declarations: [
    FormulasGridComponent,
  ],
  entryComponents: [
    FormulasGridComponent,
  ]
})
export class FormulasGridModule { }
