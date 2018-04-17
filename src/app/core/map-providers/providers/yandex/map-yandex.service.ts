import { Injectable, ComponentRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  Map,
  TileLayer,
  Marker,
  Icon,
  Popup,
  LeafletEvent,
  LatLngBounds,
  LatLngBoundsLiteral,
} from 'leaflet';

import {
  IMapOptions,
  ICreateMarkerResult,
  IMarker,
  PopupComponentRefGetter,
  IMarkerIconConfig,
  IMapService,
  IPopupCmp,
} from '../../map-providers.interface';

import { ConfigService } from '@app/core/config/config.service';
import { MapRendererService } from '../../renderer/map-renderer.service';

@Injectable()
export class MapYandexService implements IMapService {

  private static OSM_URL = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;

  readonly apiKey = this.configService.config.maps.providers.yandex.apiKey;

  constructor(
    private configService: ConfigService,
    private mapRendererService: MapRendererService,
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
      popupRef = this.createPopup<T>(map, marker, markerDef);
    }
    map.addLayer(marker);
    return { marker, popupRef };
  }

  createControl<T>(): any {
    // TODO(i.lobanov): implement;
    return _ => ({} as T);
  }

  getIconConfig(): IMarkerIconConfig {
    // TODO(i.lobanov): implement;
    return {};
  }

  createBounds(latlngs: LatLngBoundsLiteral): any {
    return new LatLngBounds(latlngs);
  }

  private createPopup<T>(map: Map, marker: Marker, markerDef: IMarker<T>): PopupComponentRefGetter<T> {
    let el: HTMLElement, compRef: ComponentRef<IPopupCmp<T>>;
    const popup = new Popup({ closeButton: false }, marker);
    marker.on('click', (e: LeafletEvent) => {
      this.zone.run(() => {
        if (compRef) {
          compRef.destroy();
        }
        const result = this.mapRendererService.render<IPopupCmp<T>>(markerDef.popup, markerDef.data);
        el = result.el;
        compRef = result.compRef;
        popup.setContent(el);
        popup.setLatLng((e.target as Marker).getLatLng());
        map.openPopup(popup);
        compRef.changeDetectorRef.detectChanges();
      });
    });

    marker.on('popupclose', _ => {
      if (compRef) {
        compRef.destroy();
      }
    });
    return () => compRef;
  }

}
