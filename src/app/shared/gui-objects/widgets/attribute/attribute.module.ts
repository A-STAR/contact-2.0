import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeGridModule } from './grid/attribute-grid.module';

@NgModule({
  imports: [
    AttributeGridModule,
    CommonModule,
  ],
  exports: [
    AttributeGridModule,
  ]
})
export class AttributeModule { }
