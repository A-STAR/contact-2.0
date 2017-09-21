import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridTreeWrapperModule } from '../../../../components/gridtree-wrapper/gridtree-wrapper.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { AttributeGridComponent } from './attribute-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridTreeWrapperModule,
    Toolbar2Module,
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
