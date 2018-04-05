import { Injectable, ComponentRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Map, TileLayer, Marker, Icon, Popup } from 'leaflet';

import { IMapOptions, ICreateMarkerResult, IMarker } from '@app/shared/components/map/map.interface';

import { ConfigService } from '@app/core/config/config.service';
import { PopupService } from '../../popup.service';

@Injectable()
export class MapYandexService {

  private static OSM_URL = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;
  constructor(
    private configService: ConfigService,
    private popupService: PopupService,
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

  createMarker(map: Map, markerDef: IMarker): ICreateMarkerResult {
    let popupRef;
    const marker = new Marker({ lat: markerDef.lat, lng: markerDef.lng });
    if (markerDef.popup) {
      popupRef = this.createPopup(marker, markerDef);
    }
    map.addLayer(marker);
    return { marker, popupRef };
  }

  private createPopup(marker: Marker, markerDef: IMarker): ComponentRef<IMarker> {
    const popup = new Popup();
    const { el, compRef } = this.popupService.render<IMarker>(markerDef.popup, markerDef.data);
    popup.setContent(el);
    marker.bindPopup(popup);
    return compRef;
  }

}
