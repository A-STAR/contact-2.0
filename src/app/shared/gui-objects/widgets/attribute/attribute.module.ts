import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeCardModule } from './card/attribute-card.module';
import { AttributeGridModule } from './grid/attribute-grid.module';

import { AttributeService } from './attribute.service';

@NgModule({
  imports: [
    AttributeCardModule,
    AttributeGridModule,
    CommonModule,
  ],
  exports: [
    AttributeCardModule,
    AttributeGridModule,
  ],
  providers: [
    AttributeService
  ]
})
export class AttributeModule { }
