import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeGridModule } from './grid/attribute-grid.module';

import { AttributeService } from './attribute.service';

@NgModule({
  imports: [
    AttributeGridModule,
    CommonModule,
  ],
  exports: [
    AttributeGridModule,
  ],
  providers: [
    AttributeService
  ]
})
export class AttributeModule { }
