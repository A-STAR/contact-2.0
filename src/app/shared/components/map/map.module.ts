import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IMapService, MapProvider } from './map.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapGoogleService } from './providers/google/map-google.service';
import { MapYandexService } from './providers/yandex/map-yandex.service';
import { PopupService } from './popup.service';

import { MapComponent, MAP_SERVICE } from './map.component';

export function mapServiceFactory(configService: ConfigService, popupService: PopupService): IMapService {
  switch (configService.config.maps.useProvider) {
    case MapProvider.GOOGLE:
      return new MapGoogleService(configService, popupService);
    case MapProvider.YANDEX:
      return new MapYandexService(configService, popupService);
    default:
      throw new Error('No map provider was found in config!');
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: MAP_SERVICE,
      useFactory: mapServiceFactory,
      deps: [ ConfigService, PopupService ]
    }
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ],
  // dynamic components, i.e. for marker popup content
  entryComponents: [

  ]
})
export class MapModule {}
