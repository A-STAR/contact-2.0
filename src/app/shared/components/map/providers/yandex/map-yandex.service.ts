import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Map, TileLayer, Marker, LatLngLiteral, Icon } from 'leaflet';

import { IMapOptions } from '@app/shared/components/map/map.interface';

import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class MapYandexService {

  private static OSM_URL = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;
  constructor(
    private configService: ConfigService
  ) {
    // override Leaflet default icon path
    Icon.Default.imagePath = 'assets/img/';
  }

  init(mapConfig: IMapOptions): Observable<any> {
    const { el, ...config } = mapConfig;
    return of(this.initMap(new Map(el as HTMLElement, config)));
  }

  initMap(map: Map): Map {
    const osm = new TileLayer(MapYandexService.OSM_URL, {
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
    });
    map.addLayer(osm);
    return map;
  }

  createMarker(map: Map, latlng: LatLngLiteral): Marker {
    const layer = new Marker(latlng);
    map.addLayer(layer);
    return layer;
  }

}
