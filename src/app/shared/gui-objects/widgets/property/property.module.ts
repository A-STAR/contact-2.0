import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyGridModule } from './grid/property-grid.module';

import { PropertyService } from './property.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PropertyGridModule,
  ],
  providers: [
    PropertyService,
  ]
})
export class PropertyModule { }
