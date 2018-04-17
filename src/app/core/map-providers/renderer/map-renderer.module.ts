import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRendererService } from './map-renderer.service';


@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [ MapRendererService ],
})
export class MapRendererModule {}
