import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridTreeModule } from '../../../../components/gridtree/gridtree.module';

import { AttributeGridComponent } from './attribute-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridTreeModule,
  ],
  exports: [
    AttributeGridComponent,
  ],
  declarations: [
    AttributeGridComponent,
  ],
  entryComponents: [
    AttributeGridComponent,
  ]
})
export class AttributeGridModule { }
