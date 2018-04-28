import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapProvidersModule } from '@app/core/map-providers/map-providers.module';

import { LayersService } from './map-layers.service';

@NgModule({
  imports: [
    CommonModule,
    MapProvidersModule,
  ],
  providers: [ LayersService ],
  declarations: []
})
export class MapLayersModule { }
