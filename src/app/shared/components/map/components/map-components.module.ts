import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupModule } from './popups/popup.module';

import { MapComponentsService } from '@app/shared/components/map/components/map-components.service';


@NgModule({
  imports: [
    CommonModule,
    PopupModule,
  ],
  providers: [ MapComponentsService ],
  exports: [ PopupModule ],
})
export class MapComponentsModule {}
