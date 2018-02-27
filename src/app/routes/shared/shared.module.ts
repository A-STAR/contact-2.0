import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeModule } from './entity-attribute/attribute.module';

@NgModule({
  imports: [
    AttributeModule,
    CommonModule,
  ],
  exports: [
    AttributeModule,
  ],
  declarations: []
})
export class RoutesSharedModule { }
