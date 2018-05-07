import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapFilterModule } from './filter/map-filter.module';
import { MapToolbarModule } from './toolbar/map-toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    MapFilterModule,
    MapToolbarModule,
  ],
})
export class MapControlsModule { }
