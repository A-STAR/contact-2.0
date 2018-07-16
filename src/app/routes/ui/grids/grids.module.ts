import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { EntityGridModule } from './entity-grid/entity-grid.module';
import { FormulaCalculateModule } from '@app/routes/utilities/formulas/calculate/calculate-dialog.module';

import { FormulasService } from '@app/routes/utilities/formulas/formulas.service';

import { GridsComponent } from './grids.component';
import {
  FormulaCalculateActionComponent
} from './entity-grid/custom-actions/formula-calculate/formula-calculate-action.component';

const routes: Routes = [
  {
    path: '',
    component: GridsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    EntityGridModule,
    FormulaCalculateModule,
  ],
  declarations: [
    GridsComponent,
    FormulaCalculateActionComponent
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    FormulasService
  ]
})
export class GridsModule {}
