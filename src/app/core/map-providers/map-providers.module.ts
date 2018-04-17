import { NgModule, NgZone, InjectionToken } from '@angular/core';

import { MapRendererModule } from '@app/core/map-providers/renderer/map-renderer.module';

import { IMapService, MapProvider } from './map-providers.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapGoogleService } from './providers/google/map-google.service';
import { MapRendererService } from './renderer/map-renderer.service';
import { MapYandexService } from './providers/yandex/map-yandex.service';

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');

export function mapServiceFactory(
  configService: ConfigService,
  mapRendererService: MapRendererService,
  zone: NgZone
): IMapService {
  const provider = configService.config && configService.config.maps && configService.config.maps.useProvider;
  switch (provider) {
    case MapProvider.GOOGLE:
      return new MapGoogleService(configService, mapRendererService, zone);
    case MapProvider.YANDEX:
      return new MapYandexService(configService, mapRendererService, zone);
    default:
      throw new Error('No map provider was found in config!');
  }
}

@NgModule({
  imports: [
    MapRendererModule
  ],
  providers: [
    {
      provide: MAP_SERVICE,
      useFactory: mapServiceFactory,
      deps: [ ConfigService, MapRendererService, NgZone ]
    }
  ],
})
export class MapProvidersModule {}
