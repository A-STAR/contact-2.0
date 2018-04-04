import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IMapService, MapProvider } from './map.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapGoogleService } from './providers/map-google.service';
import { MapYandexService } from './providers/map-yandex.service';

import { MapComponent } from './map.component';

export function mapServiceFactory(configService: ConfigService): IMapService {
  switch (configService.config.maps.useProvider) {
    case MapProvider.GOOGLE:
      return new MapGoogleService(configService);
    case MapProvider.YANDEX:
      return new MapYandexService(configService);
    default:
      throw new Error('No map provider was found in config!');
  }
}

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: MAP_SERVICE,
      useFactory: mapServiceFactory,
      deps: [ ConfigService ]
    }
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ],
})
export class MapModule {}
