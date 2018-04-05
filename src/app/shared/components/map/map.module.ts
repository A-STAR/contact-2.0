import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupModule } from './popups/popup.module';

import { IMapService, MapProvider } from './map.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapGoogleService } from './providers/google/map-google.service';
import { MapYandexService } from './providers/yandex/map-yandex.service';
import { PopupService } from './popups/popup.service';

import { MapComponent, MAP_SERVICE } from './map.component';

export function mapServiceFactory(configService: ConfigService, popupService: PopupService, zone: NgZone): IMapService {
  switch (configService.config.maps.useProvider) {
    case MapProvider.GOOGLE:
      return new MapGoogleService(configService, popupService, zone);
    case MapProvider.YANDEX:
      return new MapYandexService(configService, popupService, zone);
    default:
      throw new Error('No map provider was found in config!');
  }
}

@NgModule({
  imports: [
    CommonModule,
    PopupModule,
  ],
  providers: [
    {
      provide: MAP_SERVICE,
      useFactory: mapServiceFactory,
      deps: [ ConfigService, PopupService, NgZone ]
    }
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent, PopupModule ],
})
export class MapModule {}
