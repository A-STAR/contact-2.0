import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular/main';
import { TranslateModule } from '@ngx-translate/core';

import { GridTree2Component } from '@app/shared/components/gridtree2/gridtree2.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgGridModule.withComponents([]),
  ],
  exports: [
    GridTree2Component,
  ],
  declarations: [
    GridTree2Component,
  ]
})
export class GridTree2Module {}
