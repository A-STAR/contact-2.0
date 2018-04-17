import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupModule } from './components/popups/popup.module';

import { MapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule,
    PopupModule
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ],
})
export class MapModule {}
