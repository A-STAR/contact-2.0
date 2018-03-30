import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { FormulasService } from '../formulas.service';

import { FormulaCardComponent } from './formula-card.component';

const routes: Routes = [
  {
    path: '',
    component: FormulaCardComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    FormulaCardComponent,
  ],
  exports: [
    FormulaCardComponent,
  ],
  providers: [
    FormulasService
  ]
})
export class FormulaCardModule { }
