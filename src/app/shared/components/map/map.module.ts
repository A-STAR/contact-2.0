import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IMapService, MapProvider } from './map.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapGoogleService } from './providers/google/map-google.service';
import { MapYandexService } from './providers/yandex/map-yandex.service';
import { MapComponentsService } from './components/map-components.service';

import { MapComponent, MAP_SERVICE } from './map.component';
import { MapComponentsModule } from '@app/shared/components/map/components/map-components.module';

export function mapServiceFactory(
  configService: ConfigService,
  mapComponentsService: MapComponentsService,
  zone: NgZone
): IMapService {
  const provider = configService.config && configService.config.maps && configService.config.maps.useProvider;
  switch (provider) {
    case MapProvider.GOOGLE:
      return new MapGoogleService(configService, mapComponentsService, zone);
    case MapProvider.YANDEX:
      return new MapYandexService(configService, mapComponentsService, zone);
    default:
      throw new Error('No map provider was found in config!');
  }
}

@NgModule({
  imports: [
    CommonModule,
    MapComponentsModule,
  ],
  providers: [
    {
      provide: MAP_SERVICE,
      useFactory: mapServiceFactory,
      deps: [ ConfigService, MapComponentsService, NgZone ]
    }
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent, MapComponentsModule ],
})
export class MapModule {}
