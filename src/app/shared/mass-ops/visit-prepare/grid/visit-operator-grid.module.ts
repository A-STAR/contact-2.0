import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@app/shared/components/grid/grid.module';

import { VisitOperatorGridComponent } from './visit-operator-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    VisitOperatorGridComponent,
  ],
  declarations: [
    VisitOperatorGridComponent,
  ],
  entryComponents: [
    VisitOperatorGridComponent,
  ]
})
export class VisitOperatorGridModule { }
