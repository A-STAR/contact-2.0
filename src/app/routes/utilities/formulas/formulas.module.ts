import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { FormulasGridModule } from './grid/formulas-grid.module';

import { FormulasService } from './formulas.service';

import { FormulasGridComponent } from '@app/routes/utilities/formulas/grid/formulas-grid.component';

const routes: Routes = [
  {
    path: '',
    component: FormulasGridComponent,
    data: {
      reuse: true,
    },
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormulasGridModule
  ],
  exports: [
    FormulasGridModule,
  ],
  providers: [
    FormulasService
  ]
})
export class FormulasModule {}
