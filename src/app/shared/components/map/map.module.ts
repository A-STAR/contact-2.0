import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupModule } from './components/popups/popup.module';
import { MapControlsModule } from './components/controls/map-controls.module';

import { MapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule,
    MapControlsModule,
    PopupModule,
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ],
})
export class MapModule {}
