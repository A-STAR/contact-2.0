import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapToolbarModule } from './components/controls/toolbar/map-toolbar.module';
import { PopupModule } from './components/popups/popup.module';

import { MapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule,
    MapToolbarModule,
    PopupModule,
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ],
})
export class MapModule {}
