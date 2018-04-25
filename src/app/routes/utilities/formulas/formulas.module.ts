import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { FormulaCalculateModule } from './calculate/calculate-dialog.module';
import { FormulasGridModule } from './grid/formulas-grid.module';

import { FormulasService } from './formulas.service';

import { FormulasGridComponent } from './grid/formulas-grid.component';

const routes: Routes = [
  {
    path: '',
    component: FormulasGridComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormulaCalculateModule,
    FormulasGridModule,
  ],
  providers: [
    FormulasService
  ]
})
export class FormulasModule {}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: './formulas.module#FormulasModule',
          },
          {
            path: 'create',
            loadChildren: './card/formula-card.module#FormulaCardModule'
          },
          {
            path: ':formulaId',
            loadChildren: './card/formula-card.module#FormulaCardModule'
          },
          {
            path: '**',
            redirectTo: ''
          },
        ]
      },
    ]),
  ],
})
export class RoutesModule {}
