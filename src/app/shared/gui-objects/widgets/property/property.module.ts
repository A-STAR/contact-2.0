import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyGridModule } from './grid/property-grid.module';
import { PropertyCardModule } from './card/property-card.module';

import { PropertyService } from './property.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PropertyGridModule,
    PropertyCardModule,
  ],
  providers: [
    PropertyService,
  ]
})
export class PropertyModule { }
