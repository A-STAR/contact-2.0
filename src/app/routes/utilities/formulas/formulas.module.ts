import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { FormulaCardModule } from './card/formula-card.module';
import { FormulasGridModule } from './grid/formulas-grid.module';

import { FormulasService } from './formulas.service';

import { FormulaCardComponent } from './card/formula-card.component';
import { FormulasGridComponent } from './grid/formulas-grid.component';

const routes: Routes = [
  {
    path: '',
    component: FormulasGridComponent,
    data: {
      reuse: true,
    },
  },
  { path: 'create', component: FormulaCardComponent },
  { path: ':formulaId', component: FormulaCardComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    FormulasGridModule,
    FormulaCardModule,
  ],
  providers: [
    FormulasService
  ]
})
export class FormulasModule {}
