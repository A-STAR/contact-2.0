import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Map, TileLayer, Marker, Icon, Popup } from 'leaflet';

import { IMapOptions, ICreateMarkerResult, IMarker } from '@app/shared/components/map/map.interface';

import { ConfigService } from '@app/core/config/config.service';
import { PopupService } from '../../popups/popup.service';

@Injectable()
export class MapYandexService {

  private static OSM_URL = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;
  constructor(
    private configService: ConfigService,
    private popupService: PopupService,
    private zone: NgZone,
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

  createMarker<T>(map: Map, markerDef: IMarker<T>): ICreateMarkerResult<T> {
    let popupRef;
    const marker = new Marker({ lat: markerDef.lat, lng: markerDef.lng });
    if (markerDef.popup) {
      popupRef = this.createPopup<T>(marker, markerDef);
    }
    map.addLayer(marker);
    return { marker, popupRef };
  }

  private createPopup<T>(marker: Marker, markerDef: IMarker<T>): ComponentRef<IMarker<T>> {
    const popup = new Popup({ closeButton: false }, marker);
    const {el, compRef } = this.popupService.render<IMarker<T>>(markerDef.popup, markerDef.data);
    popup.setContent(el);
    marker.bindPopup(el);
    return compRef;
  }

}
