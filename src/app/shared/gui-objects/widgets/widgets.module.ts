import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeModule as EntityAttributeModule } from './entity-attribute/attribute.module';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    EntityAttributeModule,
  ]
})
export class WidgetsModule {}
