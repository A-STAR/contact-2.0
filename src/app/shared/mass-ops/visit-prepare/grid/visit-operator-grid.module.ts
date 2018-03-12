import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsModule } from '@app/shared/components/grids/grids.module';

import { VisitOperatorGridComponent } from './visit-operator-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridsModule,
  ],
  exports: [
    VisitOperatorGridComponent,
  ],
  declarations: [
    VisitOperatorGridComponent,
  ]
})
export class VisitOperatorGridModule { }
